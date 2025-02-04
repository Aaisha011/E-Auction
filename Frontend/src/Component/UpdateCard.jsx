import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config.json";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export default function UpdateCard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingPrice: "",
    auctionStart: "",
    auctionEnd: "",
    imageUrl: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Fetch product details when component mounts
    const fetchProductDetails = async () => {
      if (window.confirm) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("User is not authenticated. Please log in again.");
            setLoading(false);
            return;
          }
          const response = await axios.get(
            `${BASE_URL}/api/getProduct/${productId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const product = response.data.product;

          setFormData({
            name: product.name || "",
            description: product.description || "",
            startingPrice: product.startingPrice || "",
            imageUrl: null, // Images cannot be prefilled in file inputs
          });
        } catch (err) {
          console.error("Error fetching product details:", err.message);
          setError("Failed to fetch product details. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User is not authenticated. Please log in again.");
      return;
    }

    try {
      const formPayload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      }

      const response = await axios.put(
        `${BASE_URL}/api/updateProduct/${productId}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product updated successfully.");
      setTimeout(() => {
        navigate("/ProductCard", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Error updating product:", err.message);
      toast.error("Failed to update product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading product details...
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
        <div className="flex justify-center overflow-hidden min-h-screen">
          <div className="m-16 h-[80vh] w-[59vw] flex justify-center items-center rounded-md shadow-lg shadow-black">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <h1 className="text-center text-2xl text-[#c21d3d] font-bold">
                Update Form
              </h1>
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-lg text-[#c21d3d] font-semibold"
                >
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name here"
                  className="mt-1 mb-1 py-2 rounded-md text-lg border-2 border-black p-1"
                />
                <label
                  htmlFor="description"
                  className="w-[45vw] text-lg text-[#c21d3d] font-semibold"
                >
                  Description:
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="mt-1 mb-1 py-2 rounded-md text-lg border-2 border-black p-1"
                />
                <label
                  htmlFor="startingPrice"
                  className="w-[45vw] text-lg text-[#c21d3d] font-semibold"
                >
                  Starting Price:
                </label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  placeholder="Enter starting price"
                  className="mt-1 mb-1 py-2 rounded-md text-lg border-2 border-black p-1"
                />
                <label
                  htmlFor="imageUrl"
                  className="w-[45vw] text-lg text-[#c21d3d] font-semibold"
                >
                  Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="imageUrl"
                  onChange={handleChange}
                  className="mt-1 mb-1 py-2 rounded-md text-lg border-2 border-black p-1"
                />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 active:bg-green-600 w-auto h-[6vh] mt-3 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
}
