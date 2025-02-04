import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Timer, TrendingUp, CheckCircle, Award, Tag } from "lucide-react";
import { BASE_URL } from "../config.json";

const WinnerDetails = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [highestBid, setHighestBid] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [bidEnd, setBidEnd] = useState(null);

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/auction/auctions/${auctionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const auctionData = response.data.auction;
        setAuction(auctionData);

        const endTime = new Date(auctionData.auctionEnd).getTime();
        setTimeLeft(endTime - new Date().getTime());
        fetchBidHistory();
      } catch (error) {
        setError("Failed to fetch auction details. Please try again.");
        console.error(error);
      }
    };

    fetchAuctionDetails();
  }, [auctionId]);

  const fetchBidHistory = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/allBids/${auctionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBidHistory(response.data.bids);
      setHighestBid(response.data.highestBid);
    } catch (error) {
      console.error("Error fetching bid history:", error);
    }
  };

  const handleBidEnd = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auction/endAuction/${auctionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setBidEnd(response.data);
    } catch (error) {
      console.error("Error ending auction:", error);
    }
  };

  const formatTime = (ms) => {
    if (ms <= 0) return "Auction Ended";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-700">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="container mx-auto px-4 text-white">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="relative group">
            <div className="w-[45vw] rounded-2xl overflow-hidden shadow-2xl">
              {auction.Product?.imageUrl ? (
                <img
                  src={auction.Product.imageUrl}
                  alt={auction.Product.name}
                  className="border-4 border-blue-700 w-[45vw] h-[50vh] object-cover transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-black rounded-md"
                />
              ) : (
                <div className="h-[500px] bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
            </div>
            <div className="absolute top-6 right-6 bg-black/60 px-4 py-2 rounded-full flex items-center space-x-2">
              <Timer className="text-blue-400" />
              <span className="text-lg font-semibold">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="space-y-6 bg-blue-500 rounded-md p-3">
            <h1 className="text-4xl font-bold mb-3">{auction.Product?.name}</h1>
            <p className="text-gray-300 text-lg">
              {auction.Product?.description}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white text-black p-5 rounded-xl space-y-2">
                <div className="flex items-center space-x-3">
                  <Tag className="text-green-400" />
                  <h3 className="font-semibold">Starting Price</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  ${auction.Product?.startingPrice}
                </p>
              </div>

              <div className="bg-white text-black p-5 rounded-xl space-y-2">
                <div className="flex items-center space-x-3">
                  <Award className="text-yellow-400" />
                  <h3 className="font-semibold">Highest Bid</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-400">
                  {highestBid ? `$${highestBid.amount}` : "N/A"}
                </p>
              </div>
            </div>

            {bidEnd ? (
              <div className="bg-white text-black rounded-xl p-6 space-y-4">
                <p>Winner: {bidEnd.soldTo}</p>
                <p>Message: {bidEnd.message}</p>
                <p>Price: ${bidEnd.soldPrice}</p>
              </div>
            ) : (
              <p className="text-white text-lg">
                No winner details available yet.
              </p>
            )}

            <button className="w-full bg-green-500 text-black px-3 py-2 rounded-md hover:bg-green-600 active:bg-green-300 active:text-black transition-all">
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerDetails;
