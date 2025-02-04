import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import auctionLogo from "../assets/Auction.png"; // Add your auction logo here
import bgImage from "../assets/little.jpg"; // Background image for the form
import { BASE_URL } from "../config.json";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email.includes("@")) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate(data.role === "admin" ? "/AdminDashboard" : "/Home", {
          replace: true,
        });
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center overflow-hidden bg-[#c21d3d] opacity-85"
      // style={{ backgroundImage: `url(${bgImage})`  }}
    >
      <form
        className="shadow-lg shadow-black rounded-lg p-6 w-full max-w-sm bg-white bg-opacity-90 relative"
        onSubmit={handleLogin}
      >
        <div className="flex justify-center mb-6">
          <img src={auctionLogo} alt="E-Auction Logo" className="w-30 h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-[#c21d3d] mb-6">
          Login Form
        </h2>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-[#c21d3d] font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-[#c21d3d] font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="******"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white transition duration-300 mb-3 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* <button
          type="button"
          onClick={() => navigate("/AdminLogin")}
          className={`w-full py-2 px-4 rounded-md text-white transition duration-300 bg-blue-500 hover:bg-blue-600}`}
        >
          Admin Login
        </button> */}

        {/* Registration Link */}
        <p className="text-center mt-4">
          <Link to="/Registration" className="hover:text-blue-700">
            Don't have an account? Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
