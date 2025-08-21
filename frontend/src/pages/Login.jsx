import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold">L</span>
            </div>
            <h1 className="text-white text-xl font-semibold">levitation infotech</h1>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-white mb-2">Sign in to begin journey</h2>
          <p className="text-gray-400 mb-6">
            Enter your credentials to access your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md transition"
            >
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="mt-4 text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block w-1/2">
        <img
          src="/page1.png"
          alt="Connecting People with Technology"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Login;
