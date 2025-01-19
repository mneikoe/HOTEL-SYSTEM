import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      await axios.post(
        "https://www.indigaapi.atithikripa.com/api/admin/login",
        formData,
        {
          withCredentials: true,
        }
      );
      setMessage("Login successful");
      setFormData({ email: "", password: "" });
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
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex justify-center items-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className={`backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-10 border border-white/10 transition-transform duration-300 w-full max-w-md ${
            isAnimating ? "animate-fade-in-up" : ""
          }`}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            Admin Login
          </h2>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            value={formData.email}
            className="w-full p-3 mb-4 text-gray-900 border border-white/20 rounded focus:outline-none focus:border-purple-500"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            value={formData.password}
            className="w-full p-3 mb-6 text-gray-900 border border-white/20 rounded focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="w-full p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition duration-200"
          >
            Login
          </button>
          {message && (
            <div className="mt-4 p-3 bg-green-500 text-white rounded-xl animate-bounce">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
