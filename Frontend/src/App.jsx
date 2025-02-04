import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Details from "./Component/Details";
import Registration from "./Components/Registration";
import LoginForm from "./Components/LoginForm";
// import AdminLogin from "./Component/AdminLogin";
import AdminDashboard from "./Component/AdminDashboard";
// import Dashboard from "./Component/Dashboard";
import UserList from "./Component/UserList";
import UserDetail from "./Component/UserDetail";
import ProductList from "./Component/ProductList";
import AddProduct from "./Component/AddProducts";
import AuctionList from "./Component/AuctionList"; // Import AuctionList
import ProtectedRoute from "./Components/ProtectedRoute";
import BidDetail from "./Component/bidDetail";
import ProductCard from "./Component/ProductCard";
import AddAuction from "./Component/AddAuction";
import UpdateCard from "./Component/UpdateCard";
import WinnerDetails from "./Component/WinnerDetails";
import AuctionEnded from "./Component/AuctionEnded";
import AdminRegister from "./Components/AdminRegister";
import SoldProduct from "./Component/SoldProduct";
import ProductDetails from "./Component/ProductDetails";
import PaymentPage from "./Component/PaymentPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulate authentication (replace this with actual logic)
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/Registration" element={<Registration />} />
          {/* <Route path="/AdminLogin" element={<AdminLogin />} /> */}
          <Route path="/AuctionList" element={<AuctionList />} />
          <Route path="/bid-list" element={<BidDetail />} />
          <Route
            path="/auctionEnded/:auctionId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AuctionEnded />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PaymentPage />
              </ProtectedRoute>
            }
          />


          {/* Protected routes */}
          <Route
            path="/AdminRegister"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Navbar:produtId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Navbar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AuctionList/:auctionList"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AuctionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Details/:auctionId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Details />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminDashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/Dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/UserList"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UserDetail/:userId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductList"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductDetails/:productId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddProduct"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ProductCard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddAuction"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddAuction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/UpdateCard/:productId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UpdateCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SoldProduct"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <SoldProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WinnerDetails/:auctionId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <WinnerDetails />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/ProductDetails/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProductDetails />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
