import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export default function ProductCard() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Keeping all existing functions exactly the same
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/getProducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      console.log("Full API Response:", response);
    } catch (err) {
      console.error("Error fetching products:", err.response || err.message);
      setError(err.response?.data?.message || "Failed to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    console.log("Attempting to delete product:", productId);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await axios.delete(
          `${BASE_URL}/api/deleteProduct/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Delete response:", response.data);
        toast.success("Product deleted successfully");
        fetchProducts(); // Fetch products after delete to update the list
      } catch (err) {
        console.error("Error deleting product:", err.response || err.message);
        toast.error("Failed to delete the product. Please try again.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onDetails = async (productId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const productData = res.data;
      navigate(`/ProductDetails/${productId}`, {
        // state: { product: productData },
      });
    } catch (err) {
      console.error("Error fetching product details: ", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>Loading products...</p>
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

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative w-full h-52 sm:h-60 md:h-64 lg:h-72 shadow-lg rounded-lg">
                  <div className="h-[37vh] w-[31vw]">
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name || "Product Image"}
                      className="h-52 w-72 object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 flex flex-col justify-between bg-white h-full">
                  <div className="space-y-2">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-1">
                      {item.name || "N/A"}
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-3">
                      {item.description || "N/A"}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-blue-600">
                      ${item.startingPrice || "N/A"}/-
                    </p>
                  </div>
                  <div>
                    <h1
                      onClick={() => onDetails(item.id)}
                      className="cursor-pointer text-base sm:text-lg font-semibold text-blue-600 mt-4 transition-all duration-300 transform hover:text-blue-500 hover:scale-105 active:text-blue-700 active:scale-100"
                    >
                      View More
                    </h1>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Link to={`/UpdateCard/${item.id}`} className="block">
                      <button className="w-full py-2 text-sm sm:text-base text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        Update
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-full py-2 text-sm sm:text-base text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );

}
