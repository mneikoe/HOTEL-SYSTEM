import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Admin Register Component
const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageColor, setMessageColor] = useState("bg-green-500");
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
      await axios.post("http://localhost:7001/api/admin/register", formData, {
        withCredentials: true,
      });
      setMessageColor("bg-green-500");
      setMessage("Registration successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "Admin already registered"
      ) {
        setMessageColor("bg-yellow-500");
        setMessage("Admin already exists");
      } else {
        setMessageColor("bg-red-500");
        setMessage("Registration failed: " + error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register as Admin
        </h2>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Name"
          value={formData.name}
          className="w-full p-2 mb-4 text-gray-700 border rounded focus:outline-none focus:border-blue-500"
        />
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
          Register as Admin
        </button>
        {message && (
          <div
            className={`mt-4 p-2 ${messageColor} text-white rounded transition duration-200`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminRegister;
