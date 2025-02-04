import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, CheckCircle } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const auctionId = queryParams.get("auctionId");
  const amount = parseFloat(queryParams.get("amount"));
  const productName = queryParams.get("productName");

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate payment processing
  const handlePaymentProcessing = async () => {
    setIsProcessing(true);

    // Simulate API call for payment processing (replace with actual payment API)
    try {
      // Assuming an API endpoint that processes the payment
      const response = await axios.post("/api/payment/process", {
        auctionId,
        amount,
        productName,
        
        paymentMethod: "Credit Card", // You can make this dynamic or allow the user to select a payment method
      });

      if (response.status === 200) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failure");
      }
    } catch (error) {
      setPaymentStatus("failure");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!auctionId || !amount) {
      // Handle invalid parameters (auctionId or amount missing)
      navigate("/error");
    }
  }, [auctionId, amount,productName, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 pt-16 pb-10 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" text-center h-14 text-5xl font-bold bg-[#c21d3d] bg-clip-text text-transparent mb-8"
      >
        Payment Page
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-center items-center">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-blue-100 w-[50vw]">
            <button
              className="m-3 group mb-8 flex items-center gap-2 px-1 py-4 bg-gray-500 text-white backdrop-blur-md rounded-full hover:bg-blue-600 hover:text-white active:bg-green-300 transition-all duration-300 shadow-md hover:shadow-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-2"
              />
              <span className="font-medium">Back to Auction</span>
            </button>

            <div className="p-8 space-y-6">
              <h2 className="text-3xl font-semibold text-[#c21d3d]">
                Auction Payment
              </h2>

              {/* Payment details */}
              <div className="space-y-4">
                <div className="flex justify-between text-lg text-gray-700">
                  <span className="font-semibold">Product Name:</span>
                  <span className="font-semibold text-[#c21d3d]">
                    {productName}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-gray-700">
                  <span className="font-semibold">Auction ID:</span>
                  <span className="font-semibold text-[#c21d3d]">
                    {auctionId}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-gray-700">
                  <span className="font-semibold">Amount to Pay:</span>
                  <span className="font-semibold text-[#c21d3d]">
                    ${amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="mt-8">
                <button
                  onClick={handlePaymentProcessing}
                  className={`w-full px-3 py-3 rounded-xl font-bold text-lg bg-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isProcessing ? "cursor-wait opacity-60" : ""
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div
                  className={`mt-8 p-3 rounded-xl shadow-md ${
                    paymentStatus === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {paymentStatus === "success" ? (
                      <CheckCircle className="text-green-500" size={32} />
                    ) : (
                      <div className="text-red-500">❌</div>
                    )}
                    <span className="text-xl font-semibold">
                      {paymentStatus === "success"
                        ? "Payment Successful!"
                        : "Payment Failed"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;
