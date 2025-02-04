import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";

const AuctionList = () => {
  const { auctionId } = useParams();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [timeRemaining, setTimeRemaining] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchAuctions = () => {
    setLoading(true);
    setError("");
    axios
      .get(`${BASE_URL}/api/auction/auctions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.auctions)) {
          setAuctions(response.data.auctions);

          const initialTime = {};
          response.data.auctions.forEach((auction) => {
            const endTime = new Date(auction.auctionEnd).getTime();
            initialTime[auction.id] = endTime - new Date().getTime();
          });
          setTimeRemaining(initialTime);
        } else {
          setAuctions([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch auctions. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const filterAuctions = (category) => {
    if (category === "all") return auctions;

    const now = new Date();
    if (category === "upcoming") {
      return auctions.filter((a) => new Date(a.auctionStart) > now);
    }
    if (category === "ongoing") {
      return auctions.filter(
        (a) => new Date(a.auctionStart) <= now && new Date(a.auctionEnd) > now
      );
    }
    if (category === "completed") {
      return auctions.filter((a) => new Date(a.auctionEnd) <= now);
    }

    return auctions;
  };

  // const renderAuctions = (filteredAuctions) => {
  //   return filteredAuctions.length > 0 ? (
  //     filteredAuctions.map((auction) => (
  //       <div
  //         key={auction.id}
  //         className="rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform h-[63vh] w-[20vw] shadow-black"
  //       >
  //         <div className="p-4 bg-slate-100">
  //           {auction.Product?.imageUrls && (
  //             <img
  //               src={auction.Product.imageUrls[0]}
  //               alt={auction.Product?.name || "Product Image"}
  //               className="object-cover mt-4 rounded-md bg-gray-300 h-[30vh] w-[20vw]"
  //             />
  //           )}
  //           <div>
  //             <h2 className="text-lg font-bold text-gray-900">
  //               {auction.Product?.name || "No Name Available"}
  //             </h2>
  //             <p className="text-gray-600 mt-2">
  //               {auction.Product?.description || "No description available"}
  //             </p>
  //             <p className="mt-2 text-sm text-gray-900">
  //               <span className="font-bold">Starting Price:</span> ₹
  //               {auction.Product?.startingPrice || "N/A"}
  //             </p>
  //             <p className="text-sm text-gray-900">
  //               <span className="font-bold">Auction Start:</span>{" "}
  //               {new Date(auction.auctionStart).toLocaleString()}
  //             </p>
  //             <p className="text-sm text-gray-500">
  //               <span className="font-bold">Auction End:</span>{" "}
  //               {new Date(auction.auctionEnd).toLocaleString()}
  //             </p>
  //             <p
  //               className={`mt-4 font-bold ${
  //                 timeRemaining[auction.id] > 0
  //                   ? "text-green-500"
  //                   : "text-red-500"
  //               }`}
  //             >
  //               {/* Time Left: {TimeRemaining(TimeRemaining[auction.id])} */}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     ))
  //   ) : (
  //     <p className="text-white">No auctions available.</p>
  //   );

  // };

  const renderAuctions = (filteredAuctions) => {
    return filteredAuctions.length > 0 ? (
      filteredAuctions.map((auction) => {
        const now = new Date();
        let status = "upcoming";
        if (
          new Date(auction.auctionStart) <= now &&
          new Date(auction.auctionEnd) > now
        ) {
          status = "ongoing";
        } else if (new Date(auction.auctionEnd) <= now) {
          status = "completed";
        }

        const tagColors = {
          upcoming: "bg-blue-500 text-white",
          ongoing: "bg-green-900 text-white",
          completed: "bg-red-500 text-white",
        };

        return (
          <div
            key={auction.id}
            className="relative rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform md:h-[61vh] md:w-[25vw] shadow-black sm:h-[59vh] sm:w-[40vw]"
          >
            {/* Tag for auction status */}
            <div
              className={`absolute top-2 left-2 px-3 py-1 text-sm font-bold rounded ${tagColors[status]}`}
            >
              {status.toUpperCase()}
            </div>
            <div className="p-4 bg-slate-100 ">
              {auction.Product?.imageUrls && (
                <img
                  src={auction.Product.imageUrls[0]}
                  alt={auction.Product?.name || "Product Image"}
                  className="object-cover mt-4 rounded-md bg-gray-300 h-[30vh] w-[39vw] hover:shadow-md shadow-black"
                />
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {auction.Product?.name || "No Name Available"}
                </h2>
                <p className="text-gray-600 mt-2">
                  {auction.Product?.description || "No description available"}
                </p>
                <p className="mt-2 text-sm text-gray-900">
                  <span className="font-bold">Starting Price:</span> $
                  {auction.Product?.startingPrice || "N/A"}
                </p>
                <p className="text-sm text-gray-900">
                  <span className="font-bold">Auction Start:</span>{" "}
                  {new Date(auction.auctionStart).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold">Auction End:</span>{" "}
                  {new Date(auction.auctionEnd).toLocaleString()}
                </p>
                <p
                  className={`mt-4 font-bold ${
                    timeRemaining[auction.id] > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {/* Time Left: {TimeRemaining(timeRemaining[auction.id])} */}
                </p>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <p className="text-white">No auctions available.</p>
    );
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 font-bold ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <nav className="bg-[#c21d3d] text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold">Auctions</h1>
          <select
            name="auction"
            id="auction"
            className="text-black p-2 rounded-md"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            <option value="all">All Auctions</option>
            <option value="upcoming">Upcoming Auctions</option>
            <option value="ongoing">Ongoing Auctions</option>
            <option value="completed">Completed Auctions</option>
          </select>
        </nav>
        <div className=" min-h-screen py-10">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-7 ml-[4rem]">
              {renderAuctions(filterAuctions(activeCategory))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
