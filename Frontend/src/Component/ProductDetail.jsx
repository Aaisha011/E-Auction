import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";

function ProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null); // Store single product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to fetch product
  const fetchProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/getProduct/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProduct(response.data);
    } catch (err) {
      console.error("Error fetching product:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${BASE_URL}/api/deleteProduct/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Product deleted successfully");
        navigate("/products"); // Redirect to product list after deletion
      } catch (err) {
        console.error("Error deleting product:", err.response || err.message);
        alert("Failed to delete the product. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]); // Add productId to dependency array

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg bg-gray-800 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Product not found.</p>
      </div>
    );
  }

  console.log("Sidebar", <Sidebar />);
  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />{" "}
      {/* Sidebar component */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <div className="min-h-screen py-8">
          <div className="container mx-auto flex flex-col items-center m-11 h-full w-[77vw] rounded-md">
            <div className="rounded-lg overflow-hidden shadow-lg shadow-black space-y-7 p-6 bg-white">
              <div className="relative">
                <div className="h-[30vh] w-[23vw]">
                  <img
                    src={product.product.imageUrls[0]}
                    alt={product.product.name || "Product Image"}
                    className="h-full w-full rounded-lg shadow-lg border"
                  />
                </div>

                {/* Status Badge */}
                <div
                  className={`absolute top-2 left-2 px-3 py-1 rounded-md text-white text-sm font-bold ${
                    product.product.status === "sold"
                      ? "bg-red-600"
                      : product.product.status === "unsold"
                      ? "bg-green-700"
                      : "bg-yellow-500"
                  }`}
                >
                  {product.product.status || "Unknown"}
                </div>
              </div>

              <div className="text-xl">
                <h1 className="text-lg font-bold">
                  Name: {product.product.name || "N/A"}
                </h1>
                <p className="mt-2">
                  <span className="font-bold">Category: </span>{" "}
                  {product.category.name || "N/A"}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Description: </span>{" "}
                  {product.product.description || "N/A"}
                </p>
                <p className="mt-2">
                  <span className="font-bold">Price: </span> Rs.
                  {product.product.startingPrice || "N/A"}/-
                </p>
                <p className="mt-2">
                  <span className="font-bold">Status: </span>
                  {product.product.status || "N/A"}
                </p>
              </div>
              {/* <div className="flex space-x-4 mt-4">
                <Link to={`/UpdateCard/${product.id}`}>
                  <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700">
                    Update
                  </button>
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 active:bg-red-700"
                >
                  Delete
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
