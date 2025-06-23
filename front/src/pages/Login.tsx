import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Sesuaikan path

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ⬅️ Tambahkan state loading

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); // ⬅️ Mulai loading

    try {
      const userCredential = await signInWithEmailAndPassword(auth, userId, password);

      const idToken = await userCredential.user.getIdToken();

      // Kirim ID token ke backend (opsional jika perlu validasi)
      await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      window.dispatchEvent(new Event("user-changed"));
      window.location.href = "/Page1";
   } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Login gagal: " + err.message);
      } else {
        setError("Login gagal: Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false); // ⬅️ Selesai loading
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/image.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/30  z-10" />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-black/20 rounded-xl shadow-2xl p-8 w-full backdrop-blur-sm max-w-sm border border-white">
          <h2 className="text-center text-3xl font-bold tracking-tight font-montserrat text-white">
            Login
          </h2>

          <form className="space-y-4 mt-10" onSubmit={handleLogin}>
            <div>
              <label className="text-left! mb-2 block text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="your_username"
                className=" bg-white! w-full border border-[#7a422c] text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
              />
            </div>

            <div>
              <label className="text-left! mb-2 block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full border bg-white! border-[#7a422c] rounded-md text-sm px-2 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-[#7a422c]"
              />
              <div className="text-right mt-1">
                <a href="/forgot-password" className="text-sm text-white/90! hover:underline!">
                  Forgot Password?
                </a>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-6 w-20px rounded-md bg-white px-2 py-1 text-md font-semibold! text-[#7a422c]! hover:scale-105! border border-[#7a422c]! transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-[#7a422c] ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <div className="mt-2 text-sm text-center text-white/60">
              Don't have an account?{" "}
              <a href="/signup" className="text-white! hover:underline!">
                Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
