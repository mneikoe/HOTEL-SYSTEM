import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // Import the CSS file

// Admin Login Component
const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:7001/api/admin/login", formData, {
        withCredentials: true,
      });
      setMessage("Login successful");
      setIsAnimating(true);
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000); // Duration of the animation
    } catch (error) {
      setMessage("Login failed: " + error.response.data.error);
    }
  };

  return (
    <div
      className={`flex justify-center items-center min-h-screen ${
        isAnimating
          ? "animation-background"
          : "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-8 rounded-lg shadow-md w-80 animate-fade-in ${
          isAnimating ? "animation-form" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          value={formData.email}
          className="w-full p-2 mb-4 text-gray-700 border rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          value={formData.password}
          className="w-full p-2 mb-4 text-gray-700 border rounded focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>
        {message && (
          <div className="mt-4 p-2 bg-green-500 text-white rounded animate-bounce">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminLogin;
