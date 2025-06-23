import { useLocation } from 'react-router-dom';
import Analyze from '../components/Analyze';
import Navbar from '../components/Navbar';
import { useState } from 'react';

type Product = {
  brand: string;
  name: string;
  price: string;
  size: string;
  category: string;
  image_url: string;
  processed_desc: string;
  processed_how_to_use: string;
  Similarity_Score: number;
};

export default function ResultPage() {
 
  const location = useLocation();

  const image = location.state?.image || '';
  const resultText = location.state?.result || '';
  const irResults = location.state?.ir_results || [];

  const sortedResults = [...irResults].sort(
    (a, b) => b.Similarity_Score - a.Similarity_Score
  );

  // Fungsi bantu untuk mengubah string harga jadi rentang harga jika perlu
  const formatPrice = (priceString: string): string => {
    const prices = priceString
      .split('\n')
      .map(p => parseInt(p.replace(/[^\d]/g, ''), 10))
      .filter(p => !isNaN(p))
      .sort((a, b) => a - b);

    if (prices.length === 2) {
      return `Rp${prices[0].toLocaleString()} - Rp${prices[1].toLocaleString()}`;
    }
    return priceString;
  };

  // State untuk kontrol show more/less tiap produk
  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    Array(sortedResults.length).fill(false)
  );

  const toggleExpand = (index: number) => {
    setExpandedStates(prev =>
      prev.map((v, i) => (i === index ? !v : v))
    );
  };

  return (
    <>
      {/* Main background with overlay */}
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <img
          src="/back.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-10" />

        {/* Content Wrapper */}
        <div className="relative z-20 flex flex-col min-h-screen">
          <Navbar />

          {/* Image and Analysis Section */}
          <div className="flex flex-col lg:flex-row gap-3 px-6 mt-18 justify-center p-6">
            {/* Image */}
            <div className="lg:w-1/2 w-full flex justify-center">
              {image ? (
                <img
                  src={image}
                  alt="Captured face"
                  className="rounded-md max-h-96 object-contain border border-white bg-white"
                />
              ) : (
                <div className="w-full h-64 bg-white rounded-md shadow-md flex items-center justify-center text-gray-500">
                  No image available.
                </div>
              )}
            </div>

            {/* Analysis */}
            <div className="lg:w-1/2 w-full h-full flex">
              <div className="w-full">
                <Analyze concern={resultText} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="p-6 bg-gradient-to-b from-[#7a422c]/20 to-white">
        <h2 className="text-center text-2xl font-bold font-playfair text-transparent bg-gradient-to-r from-[#7a422c] to-[#b07252] mb-3 mt-10 tracking-wide bg-clip-text">
          RECOMMENDED PRODUCTS FOR YOU
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {sortedResults.map((product: Product, index: number) => {
            const desc = product.processed_desc || '';
            const isLong = desc.length > 15;
            const isExpanded = expandedStates[index];
            const displayText =
              isExpanded || !isLong ? desc : desc.slice(0, 60) + '...';

            return (
              <div
                key={index}
                className="bg-white border border-[#7a422c] rounded-md p-4 flex items-start gap-4 text-left"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-28 h-auto object-contain"
                />
                <div>
                  <h4 className="text-base font-semibold mb-1">
                    [{product.brand}] {product.name}
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    {product.size}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    Category: {product.category}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    {displayText}
                    {isLong && (
                      <button
                        onClick={() => toggleExpand(index)}
                         className="text-blue-500 ml-2 hover:underline! bg-transparent! focus:outline-none! focus:ring-0!"
>
                        {isExpanded ? 'Less' : 'More'}
                      </button>
                    )}
                  </p>
                  <p className="text-sm font-semibold mb-1">How to use</p>
                  <ul className="text-sm list-disc list-inside text-gray-700 space-y-1">
                    {product.processed_how_to_use
                      .split('\n')
                      .map((step: string, i: number) => (
                        <li key={i}>{step.trim()}</li>
                      ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
