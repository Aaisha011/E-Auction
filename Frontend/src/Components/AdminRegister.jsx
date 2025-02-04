import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/little.jpg";
import { BASE_URL } from "../config.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    address: "",
    city: "",
    state: "",
    country: "",
    contactNo: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [images, setImages] = useState([]); // To hold multiple images

  const countrie = {
    IN: "India",
    US: "United States",
    CA: "Canada",
    GB: "United Kingdom",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    BR: "Brazil",
    CN: "China",
    JP: "Japan",
    RU: "Russia",
    SA: "Saudi Arabia",
    ZA: "South Africa",
    MX: "Mexico",
    AR: "Argentina",
    EG: "Egypt",
    KE: "Kenya",
    NG: "Nigeria",
    SE: "Sweden",
    NO: "Norway",
    FI: "Finland",
    DK: "Denmark",
    SG: "Singapore",
    KR: "South Korea",
    PH: "Philippines",
    TH: "Thailand",
    ID: "Indonesia",
    MY: "Malaysia",
    PK: "Pakistan",
    BD: "Bangladesh",
    LK: "Sri Lanka",
    NP: "Nepal",
    BT: "Bhutan",
  };

  useEffect(() => {
    const countriesList = Object.keys(countrie).map((code) => ({
      code,
      country: countrie[code],
    }));
    setCountries(countriesList);
    setCountriesLoading(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setImages([...files]); // Store selected files in images array
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.contactNo ||
      !images.length // Ensure at least one image is selected
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    images.forEach((image) => {
      formDataToSend.append("image", image); // Append each image file to 'image'
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/register`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-[#c21d3d]"
      // style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-90 shadow-2xl rounded-lg overflow-hidden max-w-6xl w-auto h-auto opacity-85">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-[#c21d3d] mb-6">
            Create Account
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Username", name: "username", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Address", name: "address", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "State", name: "state", type: "text" },
                { label: "Contact Number", name: "contactNo", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-800 font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-2">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
              >
                <option value="">Select your country</option>
                {countriesLoading ? (
                  <option value="">Loading countries...</option>
                ) : (
                  countries.map((country, index) => (
                    <option key={index} value={country.country}>
                      {country.country}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                {
                  label: "Password",
                  name: "password",
                  show: showPassword,
                  setShow: setShowPassword,
                },
                {
                  label: "Confirm Password",
                  name: "confirmPassword",
                  show: showConfirmPassword,
                  setShow: setShowConfirmPassword,
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-gray-800 font-medium mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={field.show ? "text" : "password"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <span
                      onClick={() => field.setShow((prev) => !prev)}
                      className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    >
                      {field.show ? "👁️" : "👁️‍🗨️"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                multiple
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
