import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen text-white overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity opacity-70"
        // style={{
        //   backgroundImage: "url('')", // Replace with your image URL
        // }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-blue-900"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full px-6">
        {/* Welcome Text */}
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-5xl font-extrabold text-black">
            <span className="inline-block animate-slide-left">Welcome to</span>{" "}
            <span className="inline-block animate-slide-right text-blue-700">
              Auction World
            </span>
          </h1>
          <p className="text-lg font-medium leading-relaxed text-gray-700 animate-fade-in">
            Engage in thrilling bids, discover unbeatable deals, and win your
            desired items with ease. Start your journey today!
          </p>
        </div>

        {/* Explore Auctions Button */}
        {/* <button
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-800 hover:shadow-2xl transition-transform transform hover:scale-110 animate-pulse"
          onClick={() => navigate("/Home")}
        >
          Explore Auctions
        </button> */}

        <div className="flex flex-row justify-around">
          <button
            onClick={() => navigate("/LoginForm")}
            className="text-white text-lg bg-blue-700 px-7 py-3 m-5 rounded-xl "
          >
            User Login
          </button>
          <button
            onClick={() => navigate("/AdminLogin")}
            className="text-white text-lg bg-blue-700 px-3 py-5 m-5 rounded-xl  "
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
