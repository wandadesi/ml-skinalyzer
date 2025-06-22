import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Permission from '../components/ui/Permission';
import { useAuth } from '../context/AuthContext'; // ⬅️ Import useAuth
import Navbar from '../components/Navbar';

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const [showPermissionPopup, setShowPermissionPopup] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const { userId } = useAuth(); // ⬅️ Ambil userId dari context

  useEffect(() => {
    if (!isCameraReady) return;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Gagal mengakses kamera:', error);
        alert('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [isCameraReady]);

  const handleAllowCamera = () => {
    setShowPermissionPopup(false);
    setIsCameraReady(true);
  };

  const handleCancelPermission = () => {
    setShowPermissionPopup(false);
    navigate(-1);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const video = videoRef.current;

      if (ctx) {
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        const imageData = canvasRef.current.toDataURL('image/png');

        if (!userId) {
          alert("User belum login.");
          return;
        }

        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        navigate('/camres', { state: { image: imageData, user_id: userId } });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 relative">
      <Navbar />
      {showPermissionPopup && (
        <Permission
          message="Aplikasi akan meminta izin untuk menggunakan kamera Anda."
          onConfirm={handleAllowCamera}
          onCancel={handleCancelPermission}
        />
      )}

      {!showPermissionPopup && (
      
        <div className="relative min-h-screen w-full bg-white bg-cover bg-center bg-gradient-to-b from-[#7a422c] to-white">
          <video
            ref={videoRef}
            className="absolute top-20 left-0 w-full h-[60vh] object-contain "
            autoPlay
            muted
          />
          <canvas ref={canvasRef} width="640" height="480" className="hidden" />

          <div className="absolute bottom-0 left-0 w-full h-[25vh] bg-transparent px-4 flex flex-col items-center justify-center space-y-4">
            <h3 className="font-montserrat! text-[#7a422c]! text-center max-w-md mt-5">
              Make sure your face is clearly visible on the screen, then press the button to capture your photo.
            </h3>
 <button
  onClick={handleCapture}
  className="bg-[#7a422c]! hover:scale-105 text-white! rounded-full p-4 transition-transform"
>
  {/* SVG Kamera */}
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
</button>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
