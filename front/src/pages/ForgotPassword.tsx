import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Link reset password telah dikirim ke email Anda.");
    } catch (err: any) {
      setError("Gagal mengirim reset email: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
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
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Form Container */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black/20 rounded-xl shadow-2xl p-8 w-full backdrop-blur-sm max-w-sm border border-white">
          <h2 className="text-center text-3xl font-bold font-montserrat text-white">
            Reset Password
          </h2>

          <form className="space-y-4 mt-10" onSubmit={handleReset}>
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border border-[#7a422c] rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
                required
              />
            </div>

            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full rounded-md px-2 py-2 text-md font-semibold transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a422c] ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-[#7a422c] hover:scale-105 border border-[#7a422c]"
              }`}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="mt-2 text-sm text-center text-white/60">
              Back to{" "}
              <a href="/Login" className="text-white hover:underline">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
