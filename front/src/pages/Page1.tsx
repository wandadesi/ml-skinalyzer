import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Page1 = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError('');
    } else {
      setSelectedFile(null);
      setError('Please upload a valid image file.');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('No file selected');
      return;
    }

    if (!userId) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('user_id', userId);

    const imageData = URL.createObjectURL(selectedFile);

    navigate('/HasilFoto', {
      state: {
        image: imageData,
        user_id: userId,
      },
    });
  };

  const handleCamera = () => {
    navigate('/Camera');
  };

  return (
   <div className="relative min-h-screen w-full overflow-hidden">
  {/* Background Image */}
  <img 
    src="/image.png"
    alt="Background"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />

  {/* Blur Overlay */}
  <div className="absolute inset-0 bg-black/70 z-10" />

  {/* Content Wrapper */}
  <div className="relative z-20 flex flex-col min-h-screen">
    <Navbar />

    <div className="flex flex-col items-center justify-center flex-grow px-4 text-center">
      <h1 className="text-white text-3xl font-bold italic mt-20 font-playfair">
        Start Analyze Your Skin
      </h1>
      <p className="text-white font-montserrat mb-6 mt-5">
        Tap to open your camera or upload an image to start the scan
      </p>

      <div className="text-black flex flex-row space-x-6 w-full max-w-2xl justify-center">
        {/* Kotak Kamera */}
        <div className="bg-white/80 rounded-xl p-6 flex flex-col items-center shadow-md w-1/2">
          <h2 className="font-semibold text-gray-700 mb-4">Use Camera</h2>
         <button
  onClick={handleCamera}
  className="bg-[#7a422c]! hover:scale-105 text-white rounded-full p-4 transition-transform"
>
  {/* SVG Kamera */}
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
</button>

        </div>

        {/* Kotak Upload */}
        <div className="bg-white/80 rounded-xl p-6 flex flex-col items-center shadow-md w-1/2">
          <h2 className="font-semibold text-gray-700 mb-4">Upload Image</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-[#7a422c]/20! file:text-[#7a422c]! 
              hover:file:bg-[#7a422c]! hover:file:text-white!
              cursor-pointer mb-2"
          />

          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}

         <button
  onClick={handleUpload}
  disabled={!selectedFile || !userId}
  className={`${
    !selectedFile || !userId
      ? 'bg-[#7a422c]/20! cursor-not-allowed'
      : 'bg-[#7a422c]! hover:scale-105! transition-transform'
  } text-white rounded-full p-4`}
>
  {/* SVG Panah */}
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
</button>

        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Page1;
