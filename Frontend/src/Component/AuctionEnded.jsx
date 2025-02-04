import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.json";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, User, DollarSign, Package } from "lucide-react";

const AuctionEnded = () => {
  const navigate = useNavigate();
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [error, setError] = useState(null);
  const { auctionId } = useParams();

  const [mainImage, setMainImage] = useState(null); // State to manage the main image

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/auction/getEndAuction/${auctionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAuctionDetails(response.data);
        setMainImage(response.data.product.imageUrls[0]); // Set initial main image
      } catch (error) {
        setError("Error fetching auction details.");
      }
    };
    fetchAuctionDetails();
  }, [auctionId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-500 to-rose-100">
        <div className="text-red-500 text-xl font-semibold bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-red-100 animate-fade-in">
          {error}
        </div>
      </div>
    );
  }

  if (!auctionDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-indigo-600 text-2xl animate-pulse font-medium bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          Loading...
        </div>
      </div>
    );
  }

  const isWinner = auctionDetails.isUserWinner; // Server should return this
  const winnerDetails = auctionDetails.winnerDetails;
  const username =
    winnerDetails?.username || auctionDetails.winner?.username || "";
  const product = auctionDetails.product;

  const handlePayment = () => {
    // Payment logic here
    navigate(
      `/payment?auctionId=${auctionId}&amount=${product.soldPrice}&productName=${product.name}`
    );
  };

  const DEFAULT_IMAGE = "https://via.placeholder.com/400?text=No+Image";

  return (
    <div className="min-h-screen pt-6 pb-3 px-4 bg-gray-200">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-3xl font-bold text-[#c21d3d]  mt-0 mb-3"
      >
        Auction Details
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-500">
          {/* <div className=" backdrop-blur-md rounded-3xl shadow-md shadow-black overflow-hidden border border-blue-100 "> */}
          <button
            className="group m-3 flex items-center gap-3 px-4 py-2 bg-gray-700 text-white backdrop-blur-md rounded-full hover:bg-blue-500 hover:text-white active:bg-blue-100 duration-300 shadow-md hover:scale-105"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-2"
            />
            <span className="font-medium">Go Back</span>
          </button>
          {/* </div> */}
          <div className="flex flex-col md:flex-row">
            {/* Left Image */}
            <div className="md:w-1/2 p-8">
              <div className="relative top-10 rounded-2xl overflow-hidden shadow-2xl">
                {/* Main Image */}
                <div className="w-full max-w-md md:max-w-lg mb-4">
                  <img
                    src={mainImage || DEFAULT_IMAGE}
                    alt={product.name}
                    className="w-full h-[400px] object-contain rounded-2xl shadow-lg"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex mt-4 gap-3 justify-center">
                  {product.imageUrls.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded-md cursor-pointer ${
                        mainImage === img
                          ? "border-2 border-blue-600"
                          : "border-2 border-gray-300"
                      }`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="md:w-1/2 p-8 bg-gradient-to-br from-gray-50 to-blue-50/50">
              <h1 className="text-4xl font-bold mb-4 text-[#c21d3d]">
                {product.name}
              </h1>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-6 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-50">
                <div className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-[#c21d3d]" size={28} />
                    <span className="font-semibold text-gray-700">
                      Starting Price
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-[#c21d3d]">
                    ${product.startingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-3">
                    <Package className="text-[#c21d3d]" size={28} />
                    <span className="font-semibold text-gray-700">
                      Sold Price
                    </span>
                  </div>
                  <span className="text-2xl font-semibold text-[#c21d3d]">
                    ${product.soldPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Winner Details Section */}
              <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100">
                <h3 className="text-2xl font-bold mb-6 text-[#c21d3d] flex items-center gap-3">
                  <Trophy className="text-yellow-500" size={28} />
                  Winner Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-lg bg-white/80 backdrop-blur-md p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <User className="text-[#c21d3d]" size={24} />
                    <span className="font-semibold text-gray-700">
                      Winner Name:
                    </span>
                    <span className="text-[#c21d3d] font-bold">{username}</span>
                  </div>
                </div>
                {isWinner && (
                  <button
                    onClick={handlePayment}
                    className="mt-8 w-full px-5 py-3 rounded-xl font-bold text-lg bg-blue-600 text-white hover:bg-blue-800 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionEnded;
