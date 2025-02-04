import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import auction from "../Images/auction copy.png";
import { LogOut } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../config.json";
import { FaSearch } from "react-icons/fa";

export default function Navbar({ onCategoryChange, onSearch }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Auctions");
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const detailsRef = useRef(null);
  const navigate = useNavigate();

  // Logout functionality
  const submitLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${BASE_URL}/api/getUserDetails`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.userDetails);
      }
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Close dropdown/details when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        setShowDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleCategoryClick = (category) => {
    setActiveFilter(category);
    onCategoryChange(category);
    setShowDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="top-0 left-0 shadow-md w-full sticky z-50">
      <div className="py-3 px-4 flex justify-between items-center bg-[#c21d3d]">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img
            src={auction}
            alt="Auction House Logo"
            className="h-12 w-12 rounded-full ring-4 ring-[#252525] bg-white"
          />
          <h1 className="text-white text-2xl font-extrabold tracking-tight">
            Auction <span className="text-gray-800">Hub</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <FaSearch className="absolute text-gray-400 left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              className="pl-10 py-2 rounded-lg w-60 lg:w-80 border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c21d3d] transition-all"
              placeholder="Search here..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="text-white font-medium bg-[#c21d3d] border border-white py-2 px-4 rounded-lg hover:bg-white hover:text-[#c21d3d] transition"
              onClick={toggleDropdown}
            >
              {activeFilter}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                <ul className="text-gray-800">
                  {[
                    "All Auctions",
                    "Upcoming Auctions",
                    "Ongoing Auctions",
                    "Sold Auctions",
                    "Unsold Auctions",
                  ].map((category) => (
                    <li
                      key={category}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        activeFilter === category ? "font-bold" : ""
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="relative">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{user.username}</span>
                <img
                  src={user.imageUrls || "/default-profile.png"}
                  alt="User Profile"
                  className="h-10 w-10 rounded-full object-cover cursor-pointer"
                  onClick={() => setShowDetails((prev) => !prev)}
                />
                <button
                  onClick={submitLogout}
                  className="bg-white text-[#c21d3d] hover:bg-[#d63e5c] hover:text-white active:bg-[#6a0d20] p-2 rounded-full transition"
                >
                  <LogOut />
                </button>
              </div>
            ) : (
              <div className="text-white">Loading...</div>
            )}
          </div>

          {/* User Details Popup */}
          {showDetails && user && (
            <div
              ref={detailsRef}
              className="fixed top-20 right-6 w-full max-w-xs bg-white rounded-xl shadow-2xl border border-gray-100 p-6"
            >
              <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-100">
                <img
                  src={user.imageUrls || "/default-profile.png"}
                  alt="Profile"
                  className="h-16 w-16 rounded-full object-cover border-4 border-red-300"
                />
                <div>
                  <h2 className="text-xl font-bold text-[#c21d3d]">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p>
                  <strong className="text-red-700">Phone:</strong>{" "}
                  {user.contactNo}
                </p>
                <p>
                  <strong className="text-red-700">Address:</strong>{" "}
                  {user.address}
                </p>
                <p>
                  <strong className="text-red-700">City:</strong> {user.city}
                </p>
                <p>
                  <strong className="text-red-700">State:</strong> {user.state}
                </p>
                <p>
                  <strong className="text-red-700">Country:</strong>{" "}
                  {user.country}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
