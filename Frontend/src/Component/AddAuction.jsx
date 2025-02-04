import axios from "axios";
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";

const AddAuction = () => {
  const [products, setProducts] = useState([]); // Stores the product list
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    productId: "",
    auctionStart: "",
    auctionEnd: "",
  });

  // Fetch products when the component mounts
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getProducts`) // Replace with your correct API endpoint
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data); // Ensure data is an array
        } else {
          console.error("API response is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.productId || !formData.auctionStart || !formData.auctionEnd) {
      alert("Please fill all fields before submitting.");
      return;
    }

    // Submit form data to the server
    axios
      .post(`${BASE_URL}/api/auction/auctions`, formData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Auction created:", response.data);
        alert("Auction added successfully!");
        setFormData({ productId: "", auctionStart: "", auctionEnd: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Error creating auction:", error);
        alert("Failed to add auction.");
      });
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <div className="flex justify-center items-center h-[100vh] m-3">
          <div className="text-center h-[70vh] w-[50vh] p-6 shadow-lg shadow-black rounded-lg">
            <h1 className="text-2xl font-bold text-[#c21d3d] mb-6">
              Add Auction
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="product"
                  className="block text-lg font-semibold text-[#c21d3d] mb-3"
                >
                  Select Product:
                </label>
                <select
                  id="product"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="p-2 rounded-md border-2 border-black"
                  required
                >
                  <option value="productId">-- Choose a Product --</option>
                  {Array.isArray(products) &&
                    products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="auctionStart"
                  className="block text-lg font-semibold text-[#c21d3d] mb-3"
                >
                  Auction Start:
                </label>
                <input
                  type="datetime-local"
                  id="auctionStart"
                  name="auctionStart"
                  value={formData.auctionStart}
                  onChange={handleChange}
                  className="p-2 rounded-md border-2 border-black"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="auctionEnd"
                  className="block text-lg font-semibold text-[#c21d3d] mb-3"
                >
                  Auction End:
                </label>
                <input
                  type="datetime-local"
                  id="auctionEnd"
                  name="auctionEnd"
                  value={formData.auctionEnd}
                  onChange={handleChange}
                  className="p-2 rounded-md border-2 border-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="p-2 w-full text-white bg-blue-600 rounded-md hover:bg-blue-700 active:bg-green-700 active:text-black"
                onClick={() => navigate("/AuctionList")}
              >
                Add Auction
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAuction;
