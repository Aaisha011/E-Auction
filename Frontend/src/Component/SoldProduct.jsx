import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";

const ProductTable = () => {
  const [products, setProducts] = useState({
    soldProducts: [],
    unsoldProducts: [],
    pendingProducts: [],
  });

  console.log(products,"products")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeState, setActiveState] = useState("soldProducts");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch product status details
  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/getProductStatusDetails`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        const data = response.data.reduce(
          (acc, item) => ({
            ...acc,
            [item.status + "Products"]: item.products || [],
          }),
          {}
        );
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product data:", err);
        setError("Failed to fetch product data.");
        setLoading(false);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Loading state
  if (loading) {
    return <p className="text-center text-white">Loading products...</p>;
  }

  // Error state
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Render table for each category
  const renderTable = (title, productList) => {
    // Ensure productList is an array to prevent errors
    if (!Array.isArray(productList)) {
      productList = [];
    }

    return (
      <div className="overflow-x-auto shadow-lg shadow-black rounded-lg m-3">
        <h2 className="text-center text-xl m-1 text-white bg-blue-600">{title}</h2>
        {productList.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No products available.</p>
        ) : (
          <table className="min-w-full border border-gray-400 bg-white text-black text-center">
            <thead>
              <tr className="bg-blue-600 text-white text-center">
                <th className="border border-gray-600 px-4 py-2">S.No.</th>
                <th className="border border-gray-600 px-4 py-2">Image</th>
                <th className="border border-gray-600 px-4 py-2">Product Name</th>
                <th className="border border-gray-600 px-4 py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product, index) => (
                <tr key={product.id}>
                  <td className="border border-gray-600 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-600 px-4 py-2">
                    <img
                      src={product.imageUrl}
                      alt={product.name || "Product Image"}
                      className="h-16 w-16 object-cover rounded-full mx-auto"
                    />
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {product.name}
                  </td>
                  <td className="border border-gray-600 px-4 py-2">
                    {product.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 font-bold ${isSidebarOpen ? "ml-[210px]" : "ml-[60px]"}`}
      >
        <div className="min-h-screen w-full text-white p-4">
          <div className="flex justify-center gap-4 mb-4">
            {["soldProducts", "unsoldProducts", "pendingProducts"].map(
              (state) => (
                <button
                  key={state}
                  className={`px-4 py-2 rounded ${activeState === state ? "bg-blue-700 text-white" : "bg-gray-600 text-white hover:bg-blue-700"}`}
                  onClick={() => setActiveState(state)}
                >
                  {state === "soldProducts"
                    ? "Sold Products"
                    : state === "unsoldProducts"
                    ? "Unsold Products"
                    : state === "pendingProducts"
                    ? "Pending Products" : ""}
                </button>
              )
            )}
          </div>

          {/* Render the appropriate table based on activeState */}
          {activeState === "soldProducts" &&
            renderTable("Sold Products", products.soldProducts)}
          {activeState === "unsoldProducts" &&
            renderTable("Unsold Products", products.unsoldProducts)}
          {activeState === "pendingProducts" &&
            renderTable("Pending Products", products.pendingProducts)}
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
