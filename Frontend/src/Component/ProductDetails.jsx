import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../config.json";
import Sidebar from "./Sidebar";
import { Calendar, Clock, Tag, ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductDetails = () => {
  // ... keep all existing state and useEffect code ...
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/getProduct/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.data || !response.data.product) {
          setError("Product data is incomplete.");
          return;
        }

        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-2xl text-indigo-600 animate-pulse bg-white p-8 rounded-2xl shadow-lg">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-medium p-8 bg-red-50 rounded-xl shadow-md animate-fade-in">
        {error}
      </div>
    );
  }

  if (!product || !product.product) {
    return (
      <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-xl shadow-md">
        No product found.
      </div>
    );
  }

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-500 ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold pl-11 text-[#c21d3d] mb-8">
              {product.product.name}
            </h1>

            {/* Image Slider */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full rounded-xl shadow-lg"
              spaceBetween={10}
              slidesPerView={1}
            >
              {product.product.imageUrls?.map((image, index) => (
                <SwiperSlide key={index} className="relative">
                  {/* Image */}
                  <div className="h-full w-full flex justify-center items-center">
                    <img
                      src={image || "/path/to/default-image.jpg"}
                      alt={`Slide ${index + 1}`}
                      className="w-72 h-56a object-cover rounded-xl"
                    />
                  </div>

                  {/* Badge */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 text-sm font-semibold rounded-full ${
                      product.product.status === "unsold"
                        ? "bg-blue-500 text-white"
                        : product.product.status === "processing"
                        ? "bg-green-900 text-white"
                        : product.product.status === "sold"
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {product.product.status}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <p className="text-lg text-gray-700 mt-6 mb-6 leading-relaxed backdrop-blur-sm rounded-xl p-4 bg-white/50">
              {product.product.description}
            </p>

            <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-around md:items-center lg:flex lg:flex-col lg:items-start">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row">
                  <Tag className="h-6 w-6 text-emerald-600" />
                  <span className="text-lg font-semibold text-gray-800 bg-white px-4 py-1 rounded-full shadow-sm">
                    {product.product.status}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium text-indigo-600 bg-white px-4 py-1 rounded-full shadow-sm">
                    Winner: {product.winningBid?.user?.username || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="text-xl font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm">
                  StartingPrice: $
                  {product.product.startingPrice.toLocaleString()}
                </div>
                <div className="text-xl font-bold text-emerald-600 bg-white px-4 py-2 rounded-xl shadow-sm">
                  WinningPrice: $
                  {product.winningBid?.amount?.toLocaleString() || "N/A"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-2xl p-6 shadow-inner">
              <div className="flex items-center gap-4 transition-all duration-200 hover:transform hover:translate-x-2 bg-white/80 p-4 rounded-xl shadow-sm">
                <Calendar className="h-6 w-6 text-indigo-600" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Auction Start
                  </div>
                  <div className="text-gray-800">
                    {product.auction?.startDate
                      ? new Date(product.auction.startDate).toLocaleString()
                      : "Not Started"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 transition-all duration-200 hover:transform hover:translate-x-2 bg-white/80 p-4 rounded-xl shadow-sm">
                <Clock className="h-6 w-6 text-indigo-600" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Auction End
                  </div>
                  <div className="text-gray-800">
                    {product.auction?.endDate
                      ? new Date(product.auction.endDate).toLocaleString()
                      : "Not Started"}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-indigo-800"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
