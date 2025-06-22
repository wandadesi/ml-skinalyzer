import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Camres = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const image = location.state?.image;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); // cleanup listener
  }, [auth]);

  if (!image) {
    return (
      <div className="flex flex-col min-h-screen bg-white bg-cover bg-center bg-gradient-to-b from-[#7a422c]/80 to-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-white font-semibold text-lg">Image Unavailable</p>
          <button
            onClick={() => navigate('/camera')}
            className="bg-[#7a422c]! hover:scale-105! text-white! rounded-full p-4 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const handleRetake = () => {
    navigate('/camera');
  };

  const handleNext = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const imageBase64 = image.replace(/^data:image\/\w+;base64,/, '');

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: imageBase64,
          user_id: userId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menganalisis gambar');
      }

      const label = result.detection?.detections?.[0]?.label || 'No concern detected';
      const labels = result.detection?.detections
  ? [...new Set(result.detection.detections.map((d: { label: string }) => d.label))].join(', ')
  : 'No concern detected';

      navigate('/result', {
        state: {
          image: result.detection?.image_with_box || image,
          result: labels,
          ir_results: result.ir_results || [],
        },
      });

    } catch (err: any) {
      console.error('[ERROR] Error in handleNext:', err);
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white bg-cover bg-center bg-gradient-to-b from-[#7a422c]! to-white">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow space-y-4">
        <img
          src={image}
          alt="Captured"
          className="border-2 border-[#7a422c]! max-w-[90%] max-h-[60vh] mt-15"
        />

        <p className="font-montserrat font-md text-[#7a422c]! px-4 py-2 rounded">
          Looks good? You can retake the photo or move on to analysis.
        </p>

        {error && (
          <p className="text-red-500 bg-white px-4 py-2 rounded">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleRetake}
            className="text-[#7a422c]! hover:scale-105 bg-white! rounded-full p-4 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            disabled={loading || !userId}
            className="bg-[#7a422c]! text-white! rounded-full p-4 hover:scale-105! transition-transform disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-right-icon"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        
      </div>
      {loading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <svg
        className="animate-spin h-10 w-10 text-white mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-white font-semibold">Analyzing...</p>
    </div>
  </div>
)}

    </div>
  );
};

export default Camres;
