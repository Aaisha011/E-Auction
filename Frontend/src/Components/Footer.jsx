import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaSearch,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#c21d3d] text-white py-3">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-20">
          {/* <div>
            <h3 className="text-white text-lg font-bold mb-4">DOOGEE</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Teardown
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  News
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Partners
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Compare
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Download
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Feedback
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Bug Report
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Activity</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Influencers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Affiliate
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Co-branding
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Honor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Giveaway
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4 ml-6 ">Contact</h3>
            <ul className="flex flex-row m-3">
              <li>
                <Link to="#">
                  <FaFacebook className=" text-blue-700 h-6 w-6 m-1" />
                </Link>
              </li>
              <li>
                <Link to>
                  <FaInstagram className=" bg-[#e8158d] text-white h-6 w-6 m-1 rounded-full" />
                </Link>
              </li>
              <li>
                <Link to>
                  <FaTwitter className=" text-blue-700 h-6 w-6 m-1" />
                </Link>
              </li>
              <li>
                <Link to="#">
                  <FaWhatsapp className=" bg-green-700 h-6 w-6 m-1 rounded-full" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-bold mb-4">Stay in Touch</h3>
            <h5>
              Subscribe to receive updates access to exclusive deals and more...
            </h5>
            <form className="flex items-center flex-col">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-[13vw] px-11 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ,mb-3 mt-3 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-600 mt-3"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p>&copy; 2025 E-Auction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
