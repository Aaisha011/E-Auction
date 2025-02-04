import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config.json";

export default function BidDetail() {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all bids
    axios
      .get(`${BASE_URL}/api/allBids`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBids(response.data.bids);
      })
      .catch((error) => {
        setError("Failed to fetch bid details. Please try again.");
        console.error(error);
      });
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Bid Details</h1>
      {bids.length === 0 ? (
        <div className="text-center">No bids available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                Product: {bid.Product?.name || "Unknown"}
              </h2>
              <p className="text-gray-400 mb-2">
                Bid Amount:{" "}
                <span className="text-green-500">${bid.amount}</span>
              </p>
              <p className="text-gray-400 mb-2">
                User: {bid.User?.username || "Anonymous"}
              </p>
              <p className="text-gray-400">
                Email: {bid.User?.email || "Not Provided"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
