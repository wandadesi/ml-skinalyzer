import React from 'react';

const Carousel: React.FC = () => {
  const images = ['/img1.png', '/img2.png', '/img3.png'];
  const labels = ['Acne', 'Dark Spot', 'Pimple'];
  const descriptions = [
    `Acne is a skin condition that happens when your pores get clogged with excess oil, dead skin cells, and bacteria. It’s not just about one or two pimples acne can include blackheads, whiteheads, red bumps, and even deep, painful cysts. If you experience frequent breakouts, especially in clusters, chances are you’re dealing with acne. It’s common, treatable, and nothing to be ashamed of!`,

    `Pimple is one specific type of acne a small, inflamed bump on your skin that might be red, painful, or filled with pus. Pimples often pop up when you least expect them (like before an important event!). They’re caused by localized pore blockages and can be a signal that your skin needs a little more care.`,

    `Dark spots are the marks left behind after a pimple has healed or from sun exposure. These spots appear as brown or dark patches on the skin and can make your skin tone look uneven. While they’re not painful, they can be frustrating and affect your confidence. The good news? With the right treatment, dark spots can fade over time!`
  ];

  return (
    <div className="w-full px-6 mt-10 mb-20">
      <div className="flex flex-wrap justify-center gap-6">
        {images.map((src, idx) => (
          <div key={idx} className="relative w-80 h-80 perspective">
            <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
              {/* Front Side */}
              <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden">
                <img
                  src={src}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full font-medium">
                  {labels[idx]}
                </div>
              </div>

              {/* Back Side */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-b from-[#7a422c] to-[#b07252] rounded-xl p-4 flex items-center justify-center shadow-lg">
                <p className="text-justify text-white! text-sm font-normal whitespace-pre-line px-2">
                  {descriptions[idx]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
