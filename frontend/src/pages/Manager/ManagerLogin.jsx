import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManagerLogin = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://www.indigaapi.atithikripa.com/api/managers/login",
        formData,
        {
          withCredentials: true,
        }
      );
      setMessage("Login successful!");
      setTimeout(() => {
        navigate("/common-dashboard");
      }, 2000); // Duration of transition
    } catch (error) {
      setMessage("Login failed: " + error.response?.data?.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Manager Login
        </h2>
        <input
          type="text"
          name="id"
          onChange={handleChange}
          placeholder="Manager ID"
          value={formData.id}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Manager Name"
          value={formData.name}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          Login
        </button>
        {message && (
          <div className="mt-4 p-2 bg-red-500 text-white rounded-md">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ManagerLogin;
