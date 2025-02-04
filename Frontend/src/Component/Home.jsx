import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Timer, TrendingUp, CheckCircle } from "lucide-react";
import { BASE_URL } from "../config.json";
import Footer from "../Components/Footer";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRemaining, setTimeRemaining] = useState({});
  const navigate = useNavigate();

  const fetchAuctions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/api/auction/auctions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data && Array.isArray(response.data.auctions)) {
        setAuctions(response.data.auctions);
        setFilteredAuctions(response.data.auctions);

        const initialTime = {};
        response.data.auctions.forEach((auction) => {
          const endTime = new Date(auction.auctionEnd).getTime();
          initialTime[auction.id] = endTime - new Date().getTime();
        });
        setTimeRemaining(initialTime);
      } else {
        setAuctions([]);
        setFilteredAuctions([]);
      }
    } catch (error) {
      setError("Failed to fetch auctions. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        const updatedTime = {};
        auctions.forEach((auction) => {
          const endTime = new Date(auction.auctionEnd).getTime();
          const remaining = endTime - new Date().getTime();
          updatedTime[auction.id] = remaining > 0 ? remaining : 0;
        });
        return updatedTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [auctions]);

  const filterAuctions = (filter) => {
    const now = new Date();
    let filtered;
    switch (filter) {
      case "All Auctions":
        filtered = auctions;
        break;
      case "Upcoming Auctions":
        filtered = auctions.filter(
          (auction) => new Date(auction.auctionStart) > now
        );
        break;
      case "Ongoing Auctions":
        filtered = auctions.filter(
          (auction) =>
            new Date(auction.auctionStart) <= now &&
            new Date(auction.auctionEnd) > now
        );
        break;
      case "Sold Auctions":
        filtered = auctions.filter(
          (auction) => auction.Product?.status === "sold"
        );
        break;
      case "Unsold Auctions":
        filtered = auctions.filter(
          (auction) => auction.Product?.status === "unsold"
        );
        break;
      default:
        filtered = auctions;
    }
    setFilteredAuctions(filtered);
  };

  const getTimeRemaining = (ms, status) => {
    if (ms <= 0) {
      if (status === "sold") {
        return "Sold";
      } else if (status === "unsold") {
        return "Unsold";
      }
      return "Auction Ended";
    }

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm === "") {
      setFilteredAuctions(auctions);
    } else {
      const filtered = auctions.filter((auction) =>
        auction.Product?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAuctions(filtered);
    }
  };

  const renderAuctions = (auctionsList) => {
    return auctionsList.length > 0 ? (
      auctionsList.map((auction) => (
        <div
          key={auction.id}
          className="rounded-2xl overflow-hidden border border-gray-300 shadow-md shadow-black transition-all duration-300 hover:scale-105 hover:border-blue-500"
        >
          <div className="relative">
            {auction.Product?.imageUrls?.length ? (
              <div className="relative group h-[40vh] w-[27vw]">
                <img
                  src={auction.Product.imageUrls[0]}
                  alt={auction.Product.name || "Product Image"}
                  className="object-cover h-[40vh] w-[27vw] transition-transform duration-500 hover:scale-105 rounded-l-lg"
                />
                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full flex items-center">
                  <Timer className="mr-2 w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold">
                    {getTimeRemaining(
                      timeRemaining[auction.id],
                      auction.Product?.status
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-72 bg-gray-800 flex items-center justify-center">
                <p className="text-gray-500">No Image Available</p>
              </div>
            )}
          </div>

          <div className="p-6 space-y-4 bg-slate-300 text-black">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold truncate pr-4">
                {auction.Product?.name || "No Name Available"}
              </h2>
              <span className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full">
                ${auction.Product?.startingPrice || "N/A"}
              </span>
            </div>

            <p className="text-gray-700 text-sm line-clamp-2">
              {auction.Product?.description || "No description available"}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-black">
              <div className="flex items-center">
                <TrendingUp className="mr-2 w-4 h-4 text-green-400" />
                <span>
                  Starts: {new Date(auction.auctionStart).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 w-4 h-4 text-red-400" />
                <span>
                  Ends: {new Date(auction.auctionEnd).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <button
                onClick={() => {
                  if (new Date(auction.auctionStart) > new Date()) {
                    alert(
                      "This auction is not available. You cannot apply a bid on it yet."
                    );
                  } else if (new Date(auction.auctionEnd) <= new Date()) {
                    navigate(`/auctionEnded/${auction.id}`);
                  } else if (auction.Product?.status === "unsold") {
                    alert(
                      "This auction is marked as unsold and cannot be viewed."
                    );
                  } else {
                    navigate(`/details/${auction.id}`);
                  }
                }}
                disabled={
                  new Date(auction.auctionStart) > new Date() ||
                  auction.Product?.status === "unsold"
                }
                className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 group transition ${
                  new Date(auction.auctionStart) > new Date() ||
                  auction.Product?.status === "unsold"
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 transform hover:scale-105"
                }`}
              >
                <span>View Auction Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="col-span-full text-center text-black py-10">
        <p className="text-xl">No auctions available</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-white text-lg">Loading Auctions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-10 rounded-2xl text-center shadow-2xl border border-red-500/30">
          <p className="text-red-400 text-xl mb-6">{error}</p>
          <button
            onClick={fetchAuctions}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center space-x-2 mx-auto"
          >
            Retry Fetching Auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar onCategoryChange={filterAuctions} onSearch={handleSearch} />
      <div className="min-h-screen pt-7 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {renderAuctions(filteredAuctions)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
