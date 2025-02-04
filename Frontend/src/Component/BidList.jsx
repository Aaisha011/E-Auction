import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.json";

const BidList = () => {
  const [bid, setBid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  console.log("bid", bid);
  useEffect(() => {
    // Fetch all users

    const response = axios
      .get(`${BASE_URL}/api/allBids`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBid(response.data.bids);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch user data.");
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading users...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      {bid.length > 0 ? (
        <div className="overflow-x-auto shadow-lg shadow-black rounded-lg m-3">
          <h1 className="text-center text-xl m-1">Users Table</h1>
          <table className="min-w-full border-collapse border border-gray-400 bg-gray-300 text-black text-center">
            <thead className="text-center">
              <tr className="bg-gray-700 text-white text-center">
                <th className="border border-gray-500 px-4 py-2">S.No.</th>
                <th className="border border-gray-500 px-4 py-2">Product Id</th>
                <th className="border border-gray-500 px-4 py-2">User Id</th>
                <th className="border border-gray-500 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bid.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-green-500 hover:transition-all hover:scale-100 hover:text-white hover:font-bold"
                >
                  <td className="border border-gray-500 px-4 py-2">
                    {item.Product.id}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.productId}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.userId}
                  </td>
                  <td className="border border-gray-500 px-4 py-2">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="font-bold text-xl text-center p-3">
          Bid is not available
        </p>
      )}
    </div>
  );
};

export default BidList;
