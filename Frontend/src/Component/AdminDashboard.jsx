import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BASE_URL } from "../config.json";
import { Bar } from "react-chartjs-2";
// import { Bubble } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { color } from "framer-motion";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

// Register required components - Line chart
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [barchart, setBarchart] = useState([]);
  const [linechart, setLinechart] = useState([]);

  useEffect(() => {
    const barChartHandle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const chartresponse = await axios.get(
          `${BASE_URL}/api/chart/chart/auction/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        setBarchart([...barchart, chartresponse.data]);
      } catch (error) {
        console.error(
          "Error fetching chart data:",
          error.response?.data || error.message
        );
      }
    };
    barChartHandle();
  }, []);

  useEffect(() => {
    const lineChartHandle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const lineResponse = await axios.get(
          `${BASE_URL}/api/chart/chart/product/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          }
        );

        setLinechart([...linechart, lineResponse.data]);
      } catch (error) {
        console.error(
          "Error fetching chart data:",
          error.response?.data || error.message
        );
      }
    };
    lineChartHandle();
  }, []);

  console.log("barchart", barchart);
  console.log("linechart", linechart);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];

  const data = {
    labels: labels, // Array of labels for the x-axis
    datasets: [
      {
        label: "Total Auctions",
        data: barchart.map((g) => g.total),
        backgroundColor: [
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(255, 205, 86, 0.5)", // Yellow
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(201, 203, 207, 0.5)", // Grey
          "rgba(255, 159, 64, 0.5)", // Orange
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 99, 132, 1)", // Red
          "rgba(255, 205, 86, 1)", // Yellow
          "rgba(75, 192, 192, 1)", // Teal
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(201, 203, 207, 1)", // Grey
          "rgba(255, 159, 64, 1)", // Orange
        ],
        borderWidth: 1.5,
      },
      {
        label: "Completed Auctions",
        data: barchart.map((g) => g.completed),
        backgroundColor: [
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(255, 205, 86, 0.5)", // Yellow
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(201, 203, 207, 0.5)", // Grey
          "rgba(255, 99, 132, 0.5)", // Red
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(75, 192, 192, 1)", // Teal
          "rgba(255, 205, 86, 1)", // Yellow
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(201, 203, 207, 1)", // Grey
          "rgba(255, 99, 132, 1)", // Red
        ],
        borderWidth: 1.5,
      },
      {
        label: "Ongoing Auctions",
        data: barchart.map((g) => g.ongoing),
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(201, 203, 207, 0.5)", // Grey
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(255, 205, 86, 0.5)", // Yellow
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Teal
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(201, 203, 207, 1)", // Grey
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(255, 99, 132, 1)", // Red
          "rgba(255, 205, 86, 1)", // Yellow
        ],
        borderWidth: 1.5,
      },
      {
        label: "Pending Auctions",
        data: barchart.map((g) => g.pending),
        backgroundColor: [
          "rgba(153, 102, 255, 0.5)", // Purple
          "rgba(201, 203, 207, 0.5)", // Grey
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(255, 205, 86, 0.5)", // Yellow
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)", // Purple
          "rgba(201, 203, 207, 1)", // Grey
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(75, 192, 192, 1)", // Teal
          "rgba(255, 99, 132, 1)", // Red
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(255, 205, 86, 1)", // Yellow
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    color: "black",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Auction Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineData = {
    labels: labels,
    datasets: [
      {
        label: "Total Products",
        // data: [65, 59, 80, 81, 56, 55, 40],
        lineData: linechart.map((l) => l.total),
        // data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          "rgba(255, 205, 78, 0.5)", // Yellow
          "rgba(255, 159, 64, 0.5)", // Orange
          "rgba(255, 99, 132, 0.5)", // Red
          "rgba(75, 192, 192, 0.5)", // Teal
          "rgba(54, 162, 235, 0.5)", // Blue
          "rgba(201, 203, 207, 0.5)", // Grey
          "rgba(153, 102, 255, 0.5)", // Purple
        ],
        borderColor: [
          "rgba(255, 205, 78, 1)", // Yellow
          "rgba(255, 159, 64, 1)", // Orange
          "rgba(255, 99, 132, 1)", // Red
          "rgba(75, 192, 192, 1)", // Teal
          "rgba(54, 162, 235, 1)", // Blue
          "rgba(201, 203, 207,1)", // Grey
          "rgba(153, 102, 255, 1)", // Purple
        ],
        borderWidth: 1.7,
      },

      {
        label: "Sold Product",
        // data: [56, 90, 34, 76, 32, 55, 45],
        // data: [65, 59, 80, 81, 56, 55, 40],
        data: linechart.map((l) => l.sold),
        backgroundColor: [
          "{{b}}}",
          "rgba(134, 233, 12, 0.2)",
          "rgba(255, 123, 64, 0.2)",
          "rgba(255, 243, 86, 0.2)",
          "rgba(75, 191, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 123, 132)",
          "rgb(255, 234, 64)",
          "rgb(255, 133, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1.7,
      },

      {
        label: "Unsold Product",
        // data: [56, 76, 78, 65, 23, 33, 90],
        // data: [44, 56, 32, 12, 78, 12, 28],
        data: linechart.map((l) => l.unsold),
        backgroundColor: [
          "{{b}}}",
          "rgba(123, 123, 32, 0.5)",
          "rgba(115, 123, 64, 0.5)",
          "rgba(145, 243, 86, 0.5)",
          "rgba(715, 191, 192, 0.5)",
          "rgba(234, 162, 235, 0.5)",
          "rgba(234, 102, 255, 0.5)",
          "rgba(124, 203, 207, 0.5)",
        ],
        borderColor: [
          "rgb(255, 253, 132, 1)",
          "rgb(255, 159, 64, 1)",
          "rgb(255, 205, 86, 1)",
          "rgb(75, 192, 192, 1)",
          "rgb(54, 162, 235, 1)",
          "rgb(153, 102, 255, 1)",
          "rgb(241, 232, 225, 1)",
        ],
        borderWidth: 1.7,
      },
      {
        label: "Pending Product",
        // data: [56, 76, 78, 65, 23, 33, 90],
        // data: [44, 56, 32, 12, 78, 12, 28],
        data: linechart.map((l) => l.pending),
        backgroundColor: [
          "{{b}}}",
          "rgba(123, 255, 32, 0.2)",
          "rgba(115, 123, 64, 0.2)",
          "rgba(145, 243, 86, 0.2)",
          "rgba(715, 191, 192, 0.2)",
          "rgba(234, 162, 235, 0.2)",
          "rgba(234, 102, 255, 0.2)",
          "rgba(124, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 253, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(241, 232, 225)",
        ],
        borderWidth: 1.7,
      },
    ],
  };
  const lineOptions = {
    responsive: true,
    color: "purple",
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        color: "black",
        text: "Product Data",
      },
    },
    scales: {
      y: {
        beginAtZero: true, // Start the Y-axis at zero
      },
    },
  };

  return (
    <div className="flex relative h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 font-bold ${
          isSidebarOpen ? "ml-[210px]" : "ml-[60px]"
        }`}
      >
        {/* Top Navigation Bar */}
        <nav className="bg-[#c21d3d] text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </nav>

        {/* Dashboard Content */}
        {/* <div className="p-6 flex-1 overflow-y-auto mb-16">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="mt-4 text-gray-600">
            Welcome to the Admin Dashboard. Here, you can manage your platform
            effectively!
          </p>
        </div> */}
        <div style={{ width: "80%", margin: "3rem" }}>
          <div className=" rounded-md shadow-lg shadow-black">
            <Bar data={data} options={options} className="m-7" />
          </div>
          <div className=" rounded-md shadow-lg shadow-black">
            <Line
              data={lineData}
              options={lineOptions}
              className=" m-7"
              text={lineData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
