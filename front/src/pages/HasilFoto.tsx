// src/pages/HasilFoto.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface LocationState {
  image: string;
  user_id: string;
}

const HasilFoto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, user_id } = location.state as LocationState;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!image || !user_id) {
      setError('Missing image or user ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const base64 = await toBase64FromUrl(image);

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: base64,
          user_id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Analysis failed');
      }

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
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Convert ObjectURL to Base64
  const toBase64FromUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.responseType = 'blob';
      xhr.open('GET', url);
      xhr.send();
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#7a422c]/80 to-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow px-4 space-y-4 mt-10">
        <h2 className="text-white text-xl font-semibold">Your Uploaded Image</h2>

        {image && (
          <img
            src={image}
            alt="Uploaded"
            className="max-w-[90%] max-h-[60vh] border-2 border-[#7a422c] rounded-md"
          />
        )}

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-[#7a422c]! text-white px-6 py-2 rounded-full hover:scale-105 transition disabled:opacity-50"
        >
          Analyze
        </button>
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

export default HasilFoto;
