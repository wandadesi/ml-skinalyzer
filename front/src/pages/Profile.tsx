import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Pastikan path ini sesuai

export default function ProfileSettingsPage() {
  const navigate = useNavigate();

  // const [profile, setProfile] = useState({
  //   name: 'John Doe',
  //   email: 'john@example.com',
  //   avatar: '',
  // });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value, files } = e.target;
  //   if (name === 'avatar' && files && files[0]) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
  //     };
  //     reader.readAsDataURL(files[0]);
  //   } else {
  //     setProfile((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Saved profile:', profile);
  //   alert('Profile updated!');
  // };

const handleLogout = async () => {
  try {
    await signOut(auth);
    window.dispatchEvent(new Event("user-changed")); // biar Navbar update state
    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};



  const goToHistory = () => {
    navigate('/history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6 mt-10">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl shadow-lg p-8">
        <h2 className="font-montserrat! text-3xl font-bold mb-8 text-blue-700 text-center">
          Profile Settings
        </h2>

        {/* History Button */}
        <div className="mb-8 flex text-center justify-center">
          <button
            onClick={goToHistory}
            className="font-montserrat! text-blue-600 hover:text-blue-800 font-medium underline"
            type="button"
          >
            View History
          </button>
        </div>

        {/* <form onSubmit={handleSubmit} className="space-y-8">
         
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-blue-300 overflow-hidden shadow-inner bg-blue-50 flex items-center justify-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-400 text-sm select-none">No Image</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              name="avatar"
              onChange={handleChange}
              className="cursor-pointer text-blue-600 hover:text-blue-800"
            />
          </div>

       
          <div>
            <label
              htmlFor="name"
              className="text-left block text-sm font-semibold text-blue-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200 text-blue-900 font-medium"
              placeholder="Enter your full name"
            />
          </div>

        
          <div>
            <label
              htmlFor="email"
              className="text-left block text-sm font-semibold text-blue-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-200 text-blue-900 font-medium"
              placeholder="Enter your email address"
            />
          </div>

         
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600! hover:bg-blue-700! text-white font-bold py-3 px-8 rounded-2xl shadow-md transition"
            >
              Save Changes
            </button>
          </div>
        </form> */}
        <button
  onClick={handleLogout}
  className="text-white! px-4 py-1 bg-red-400! rounded-full hover:bg-red-700! transition"
>
  Logout
</button>

      </div>
    </div>
  );
}
