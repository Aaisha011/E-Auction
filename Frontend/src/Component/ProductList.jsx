import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";

const ProductList = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  const { productId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/getProducts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProduct(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch product data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;

    if (selectedStatus === "all") {
      setFilteredProducts(product); // Show all products
    } else {
      const filtered = product.filter(
        (item) =>
          item.status &&
          item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };

  const handleRowClick = async (productId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/getProduct/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const productData = res.data;
      navigate(`/ProductDetails/${productId}`, {
        state: { product: productData },
      });
    } catch (err) {
      console.error("Error fetching product details: ", err);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg">{error}</p>;
  }

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <nav className="bg-[#c21d3d] text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold">Product Table</h1>
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search products..."
              className="flex justify-center items-center pl-10 pr-4 py-2 rounded-full bg-white text-gray-950 border border-gray-700 focus:ring-2 focus:ring-blue-500 transition w-full"
              onChange={(event) => {
                const searchQuery = event.target.value.toLowerCase();
                const filtered = product.filter((item) =>
                  item.name.toLowerCase().includes(searchQuery)
                );
                setFilteredProducts(filtered);
              }}
            />
            <Search
              className="absolute left-3 top-3 mr-3 text-gray-400"
              size={18}
            />
          </div>

          <div>
            <select
              name="product"
              id="product"
              className="text-black p-2 rounded-md"
              onChange={handleFilterChange}
            >
              <option value="all">All Products</option>
              <option value="processing">Processing Products</option>
              <option value="sold">Sold Products</option>
              <option value="unsold">Unsold Products</option>
              <option value="pending">Pending Products</option>
            </select>
          </div>
        </nav>

        <div className="min-h-screen text-black p-4">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto shadow-lg shadow-black rounded-lg m-3">
              <table className="min-w-full border-collapse border border-gray-400 text-black text-center text-sm sm:text-base">
                <thead>
                  <tr className="bg-[#c21d3d] text-white">
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      S.No.
                    </th>
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      Image
                    </th>
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      Product Name
                    </th>
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      Description
                    </th>
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      Starting Price
                    </th>
                    <th className="border border-gray-500 px-6 py-3 text-lg">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item.id)}
                      className="hover:bg-green-300 hover:transition-all hover:scale-100 hover:text-white hover:font-bold cursor-pointer"
                    >
                      <td className="border border-gray-500 px-6 py-3">
                        {index + 1}
                      </td>
                      <td className="border border-gray-500 px-6 py-3">
                        <img
                          className="object-cover w-[3vw] h-[3vw] rounded-full ring-1 ring-red-900"
                          src={item.imageUrls[0] || ""}
                          alt="Product"
                        />
                      </td>
                      <td className="border border-gray-500 px-6 py-3">
                        {item.name || "N/A"}
                      </td>
                      <td className="border border-gray-500 px-6 py-3">
                        {item.description || "N/A"}
                      </td>
                      <td className="border border-gray-500 px-6 py-3">
                        ${item.startingPrice || "N/A"}
                      </td>
                      <td className="border border-gray-500 px-6 py-3">
                        {item.status || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
