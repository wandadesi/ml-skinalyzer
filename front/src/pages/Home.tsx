import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageCarousel from '../components/Carousel';
import StepsCarousel from '../components/StepsCarousel';
import { useNavigate } from 'react-router-dom';

// Di dalam komponen:


const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full m-0 p-0 border-0 hide-scrollbar overflow-auto">
      {/* <Navbar /> */}
      <div className="relative flex-grow flex flex-col mt-0 min-h-screen w-full m-0 p-0 border-0 hide-scrollbar overflow-auto">

  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center z-0"
    style={{
      backgroundImage: `url("/back.png")`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />

  {/* Black transparent overlay */}
  <div className="absolute inset-0 bg-black opacity-50 z-10" />
<Navbar />
  {/* Content above background */}
  <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12">
 
 
 <h1 className="moving-text text-5xl! md:text-6xl! font-bold font-playfair text-white italic mt-5 mb-3 max-w-6xl break-words tracking-wider leading-snug text-center">
  Smart Beauty <br />
  Starts with Your <br />
  Facial Skin
</h1>

<p className="text-white text-l font-light mb-0 mt-0">
  Your AI-Powered Personal Skin Advisor
</p>
 <h3 className="mt-6"onClick={() => navigate('/Page1')}>
  <span className="inline-flex items-center gap-2 px-4 py-2 border border-white rounded-md text-white text-md font-medium backdrop-blur-sm bg-white/10 cursor-pointer hover:bg-white/20 transition">
    Get Started
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
</h3>


  
   
    </div>
</div>

      <div className="flex-grow flex flex-col mt-0 min-h-screen w-full m-0 p-0 border-0 bg-cover bg-center hide-scrollbar overflow-auto bg-gradient-to-b from-[#7a422c]/20 to-white"
      // style={{
      //   backgroundImage: `url("/bg-home2.png")`,
      //   backgroundRepeat: 'no-repeat',
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      // }}
      >
     <h2 id="awal" className="text-center text-2xl font-bold font-playfair text-transparent bg-gradient-to-r from-[#7a422c] to-[#b07252] mb-3 mt-15 tracking-wide bg-clip-text">
  DISCOVER YOUR TRUE BEAUTY
    </h2>

    <div className="flex flex-row items-center justify-center gap-8 px-12 mt-10">
  {/* Gambar discover */}
  <img
    src="/discover.png"
    alt="Discover"
    className="w-60 h-auto object-contain rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
  />

  {/* Teks deskripsi */}
  <p className="text-black text-left ml-15 font-montserrat font-light text-lg max-w-2xl leading-relaxed">
    Skinalyzer is a smart beauty platform that helps you understand your facial skin like never before. Using advanced AI technology, we analyze your facial condition and recommend the best skincare products just from a single photo.
  </p>
</div>


       <h2  id="features"
       className="text-center text-2xl font-bold font-playfair text-transparent bg-gradient-to-r from-[#7a422c] to-[#b07252] mb-3 mt-15 tracking-wide bg-clip-text">
  SKINALYZER DETECT YOUR COMMON FACE CONCERNS
    </h2>
    <ImageCarousel />
<StepsCarousel />
    </div>
    
    
    <Footer />

    </div>
    
  );
};
export default Home;