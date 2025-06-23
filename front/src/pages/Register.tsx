import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        email,
        createdAt: new Date(),
      });

      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "/Login";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Registrasi gagal: " + err.message);
      } else {
        setError("Registrasi gagal: Terjadi kesalahan tak dikenal.");
      }
    } finally {
      setIsLoading(false);
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
          <h2 className="text-center text-3xl font-bold tracking-tight font-montserrat text-white">
            Register
          </h2>

          <form className="space-y-4 mt-10" onSubmit={handleRegister}>
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full border border-[#7a422c] bg-white! text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border bg-white! border-[#7a422c] text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full bg-white! border border-[#7a422c] rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className={`mt-6 w-15px bg-white! text-[#7a422c]! rounded-md px-2 py-2 text-md font-semibold text-white transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a422c] ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#7a422c]! hover:scale-105"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            <div className="mt-2 text-sm text-center text-white/60">
              Already have an account?{" "}
              <a href="/Login" className="text-white! hover:underline">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
