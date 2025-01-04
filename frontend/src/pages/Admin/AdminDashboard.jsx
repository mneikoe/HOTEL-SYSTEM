import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

// Socket connection
const socket = io("http://localhost:7001", { withCredentials: true });

const AdminDashboard = () => {
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get("/api/managers");
        setManagers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    fetchManagers();

    socket.on("managers", (data) => {
      setManagers(Array.isArray(data) ? data : []);
    });

    return () => socket.off("managers");
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      socket.emit("updateManager", formData);
    } else {
      socket.emit("createManager", formData);
    }
    setFormData({ id: "", name: "", email: "", password: "" });
  };

  const handleDelete = (id) => {
    socket.emit("deleteManager", id);
  };

  const handleEdit = (manager) => {
    setFormData({ ...manager, id: manager._id });
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="Name"
          value={formData.name}
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Email"
          value={formData.email}
          className="block mb-2 p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          onChange={handleChange}
          placeholder="Password"
          value={formData.password}
          className="block mb-2 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {formData.id ? "Update Manager" : "Add Manager"}
        </button>
      </form>

      <h3 className="text-xl font-bold mb-4">Managers List</h3>
      {!Array.isArray(managers) || managers.length === 0 ? (
        <p>No managers found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map((manager) => (
              <tr key={manager._id}>
                <td className="border px-4 py-2">{manager._id}</td>
                <td className="border px-4 py-2">{manager.name}</td>
                <td className="border px-4 py-2">{manager.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(manager)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(manager._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
