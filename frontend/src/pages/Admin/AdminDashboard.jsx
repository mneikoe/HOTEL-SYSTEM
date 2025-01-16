import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import PropTypes from "prop-types";

// Socket connection
const socket = io("http://localhost:7001", { withCredentials: true });

const AdminDashboard = () => {
  const [managers, setManagers] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    dateOfJoining: "",
    type: "manager", // 'manager' or 'receptionist'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const managersResponse = await axios.get(
          "http://localhost:7001/api/managers"
        );
        const receptionistsResponse = await axios.get(
          "http://localhost:7001/api/receptionists"
        );
        setManagers(
          Array.isArray(managersResponse.data) ? managersResponse.data : []
        );
        setReceptionists(
          Array.isArray(receptionistsResponse.data)
            ? receptionistsResponse.data
            : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    socket.on("managers", (data) => {
      setManagers(Array.isArray(data) ? data : []);
    });

    socket.on("receptionists", (data) => {
      setReceptionists(Array.isArray(data) ? data : []);
    });

    return () => {
      socket.off("managers");
      socket.off("receptionists");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint =
      formData.type === "manager" ? "updateManager" : "updateReceptionist";
    if (formData.id) {
      socket.emit(endpoint, formData);
    } else {
      socket.emit(
        formData.type === "manager" ? "createManager" : "createReceptionist",
        formData
      );
    }
    setFormData({
      id: "",
      name: "",
      email: "",
      password: "",
      dateOfJoining: "",
      type: "manager",
    });
  };

  const handleDelete = (id, type) => {
    socket.emit(
      type === "manager" ? "deleteManager" : "deleteReceptionist",
      id
    );
  };

  const handleEdit = (person, type) => {
    setFormData({ ...person, id: person._id, type });
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:7001/api/admin/logout",
        {},
        {
          withCredentials: true,
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navigateToCommonDashboard = () => {
    navigate("/common-dashboard");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-center mb-10 text-white">
        Admin Dashboard
      </h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded-lg mb-4 shadow-lg transition-transform transform hover:scale-105"
      >
        Logout
      </button>

      <button
        onClick={navigateToCommonDashboard}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-10 shadow-lg transition-transform transform hover:scale-105"
      >
        Common Dashboard
      </button>

      {/* Employee Management Section */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg shadow-xl rounded-lg p-6">
        <h3 className="text-3xl font-semibold text-center mb-6 text-white">
          Employee Management
        </h3>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Name"
            value={formData.name}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            value={formData.email}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="date"
            name="dateOfJoining"
            onChange={handleChange}
            value={formData.dateOfJoining}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <div className="col-span-1 md:col-span-2 flex items-center justify-center">
            <label className="block text-lg font-medium text-white mr-4">
              Role
            </label>
            <select
              name="type"
              onChange={handleChange}
              value={formData.type}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg w-full md:col-span-2 transition-transform transform hover:scale-105"
          >
            {formData.id ? "Update" : "Add"}
          </button>
        </form>

        <div className="w-full max-w-5xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg shadow-xl rounded-lg p-6">
          <h4 className="text-2xl font-semibold mb-4 text-white">Managers</h4>
          {!Array.isArray(managers) || managers.length === 0 ? (
            <p className="text-white">No managers found.</p>
          ) : (
            <table className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date of Joining
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager._id} className="border-t">
                    <td className="py-3 px-4">{manager._id}</td>
                    <td className="py-3 px-4">{manager.name}</td>
                    <td className="py-3 px-4">{manager.email}</td>
                    <td className="py-3 px-4">
                      {new Date(manager.dateOfJoining).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(manager, "manager")}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(manager._id, "manager")}
                        className="text-red-500 hover:text-red-700"
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

        <div className="w-full max-w-5xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg shadow-xl rounded-lg p-6 mt-8">
          <h4 className="text-2xl font-semibold mb-4 text-white">
            Receptionists
          </h4>
          {!Array.isArray(receptionists) || receptionists.length === 0 ? (
            <p className="text-white">No receptionists found.</p>
          ) : (
            <table className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Date of Joining
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map((receptionist) => (
                  <tr key={receptionist._id} className="border-t">
                    <td className="py-3 px-4">{receptionist._id}</td>
                    <td className="py-3 px-4">{receptionist.name}</td>
                    <td className="py-3 px-4">{receptionist.email}</td>
                    <td className="py-3 px-4">
                      {new Date(
                        receptionist.dateOfJoining
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(receptionist, "receptionist")}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(receptionist._id, "receptionist")
                        }
                        className="text-red-500 hover:text-red-700"
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
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default AdminDashboard;
