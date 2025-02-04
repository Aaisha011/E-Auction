import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";

const UserDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  if (!user) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">No user data available.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete user ${user.name || "this user"}?`
      );
      if (!confirmDelete) return;

      await axios.delete(`${BASE_URL}/api/users/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("User deleted successfully!");
      navigate(-1); // Navigate back to the previous page
    } catch (error) {
      console.error("Failed to delete the user:", error);
      alert("Failed to delete the user. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <Sidebar />
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Go Back
      </button>
      <div className="flex flex-col items-center">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt={`${user.name}'s avatar`}
          className="rounded-full h-32 w-32 object-cover border-2 border-gray-300 mb-6"
        />
        <h1 className="text-2xl font-bold mb-2">{user.name || "N/A"}</h1>
        <p className="text-lg text-gray-600 mb-2">
          Email: {user.email || "N/A"}
        </p>
        <p className="text-lg text-gray-600 mb-2">Role: {user.role || "N/A"}</p>
        <p className="text-lg text-gray-600">
          Additional Info: This is where you can add custom user information or
          details fetched from another API.
        </p>
        <button
          onClick={handleDelete}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
