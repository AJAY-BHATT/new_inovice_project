import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { name, email, password });
      navigate("/");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
      {/* Navbar */}
      <div className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Levitation" className="w-8" />
          <h1 className="text-lg font-semibold">levitation <span className="text-gray-400 text-sm">infotech</span></h1>
        </div>
        <button className="border border-green-400 text-green-400 px-4 py-1 rounded hover:bg-green-400 hover:text-black transition">
          Connecting People With Technology
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-6 lg:px-20 gap-12">
        {/* Left Image */}
        <div className="hidden lg:block">
          <img
            src="/login-banner.png"
            alt="Levitation Banner"
            className="rounded-xl shadow-2xl"
          />
        </div>

        {/* Right Form */}
        <div className="bg-[#121212] p-10 rounded-2xl shadow-lg max-w-md w-full">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="Levitation" className="w-8" />
            <h1 className="text-lg font-semibold">
              levitation <span className="text-gray-400 text-sm">infotech</span>
            </h1>
          </div>

          <h2 className="text-3xl font-bold mb-2">Let the Journey Begin!</h2>
          <p className="text-gray-400 text-sm mb-6">
            This is a basic signup page which is used for levitation assignment purpose.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/" className="text-green-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
