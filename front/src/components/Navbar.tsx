import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.dispatchEvent(new Event("user-changed"));
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 py-3 rounded-b-xl transition-all duration-300 bg-transparent backdrop-blur-none hover:bg-white/20 hover:backdrop-blur-md shadow-none hover:shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-flower text-white transition-colors duration-300"
          >
            <circle cx="12" cy="12" r="2" />
            <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" />
            <path d="M12 7.5V9" />
            <path d="M7.5 12H9" />
            <path d="M16.5 12H15" />
            <path d="M12 16.5V15" />
            <path d="m8 8 1.88 1.88" />
            <path d="M14.12 9.88 16 8" />
            <path d="m8 16 1.88-1.88" />
            <path d="M14.12 14.12 16 16" />
          </svg>
          <span className="text-white! text-md italic transition-colors duration-300">
            Skinalyzer
          </span>
        </a>

        <div className="flex items-center space-x-5">
          <a
            href="/History"
            className="font-montserrat text-base text-white! transition"
          >
            History
          </a>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
  onClick={() => setIsDropdownOpen((prev) => !prev)}
  className="bg-transparent! transition"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-7 w-7 text-white"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
</button>



              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-sm text-white px-4 py-2 bg-red-400! rounded-md shadow-lg hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/Login"
              className="text-sm border border-white text-white! bg-white/30 px-4 py-2 rounded-full hover:bg-white hover:text-[#7a422c] transition"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;