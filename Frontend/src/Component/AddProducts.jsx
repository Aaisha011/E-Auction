import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [images, setImages] = useState([]); // To hold multiple images
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startingPrice: "",
    categoryId: "",
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/category/getCategories`
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setImages([...files]); // Store selected files in images array
    } else if (name === "categoryId") {
      setFormData((prevData) => ({
        ...prevData,
        categoryId: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    const formPayload = new FormData();
    for (const key in formData) {
      formPayload.append(key, formData[key]);
    }

    // Append all images to FormData
    images.forEach((image) => {
      formPayload.append("image", image); // Append each image file to imageUrls
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/createProduct`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product created successfully!");
        setTimeout(() => {
          navigate("/ProductCard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error.response || error.message);
      toast.error("Error creating product. Please try again.");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/category/categories`, {
        name: newCategory,
      });

      if (response.data.success) {
        const addedCategory = response.data.category;

        // Add the new category to the dropdown list dynamically
        setCategories((prevCategories) => [...prevCategories, addedCategory]);

        // Close the popup and reset the input
        setNewCategory("");
        setShowCategoryPopup(false);
        toast.success("Category added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add category.");
        setShowCategoryPopup(false);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category. Please try again.");
    }
  };

  return (
    <div className="rounded-lg">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex justify-center items-center h-[100vh] ml-32">
        <div className="max-w-2xl mx-auto p-6 shadow-lg shadow-black rounded-lg">
          <h1 className="text-center text-2xl font-bold text-[#c21d3d] mb-6">
            Create Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-lg text-[#c21d3d] font-semibold">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                placeholder="Enter auction item name"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-lg text-[#c21d3d] font-semibold">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                placeholder="Enter auction item description"
                rows="4"
              ></textarea>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-lg text-[#c21d3d] font-semibold">
                Category
              </label>
              <div className="flex items-center gap-2">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCategoryPopup(true)}
                  className="w-8 h-8 bg-green-600 text-white rounded-full flex justify-center items-center hover:bg-green-800"
                >
                  +
                </button>
              </div>
            </div>

            {/* Starting Price Field */}
            <div>
              <label className="block text-lg text-[#c21d3d] font-semibold">
                Starting Price
              </label>
              <input
                type=""
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                placeholder="Enter starting price"
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-lg text-[#c21d3d] font-semibold">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                multiple
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
              />
            </div>

            {/* Image Previews (optional) */}
            {images.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900">Selected Images:</h3>
                <div className="flex gap-2 mt-2">
                  {Array.from(images).map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-20 h-20 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white  hover:bg-blue-700 hover:scale-105 py-2 rounded-lg active:bg-green-800 transition "
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Category Popup */}
      {showCategoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Add
              </button>
              <button
                onClick={() => setShowCategoryPopup(false)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
