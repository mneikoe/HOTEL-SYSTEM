import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import PropTypes from "prop-types";
import "./AdminDashboard.css";

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
        const managersResponse = await axios.get("/api/managers");
        const receptionistsResponse = await axios.get("/api/receptionists");
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
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      <button
        onClick={navigateToCommonDashboard}
        className="common-dashboard-button"
      >
        Common Dashboard
      </button>

      {/* Employee Management Section */}
      <div className="section employee-management-section">
        <h3 className="section-title">Employee Management</h3>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Name"
            value={formData.name}
            className="input-field"
            required
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            value={formData.email}
            className="input-field"
            required
          />
          <input
            type="date"
            name="dateOfJoining"
            onChange={handleChange}
            value={formData.dateOfJoining}
            className="input-field"
            required
          />
          <div className="role-selection">
            <label className="role-label">Role</label>
            <select
              name="type"
              onChange={handleChange}
              value={formData.type}
              className="input-field"
            >
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          <button type="submit" className="submit-button">
            {formData.id ? "Update" : "Add"}
          </button>
        </form>

        <div className="list-section">
          <h4 className="list-title">Managers</h4>
          {!Array.isArray(managers) || managers.length === 0 ? (
            <p className="no-data-message">No managers found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Date of Joining</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr key={manager._id}>
                    <td className="table-cell">{manager._id}</td>
                    <td className="table-cell">{manager.name}</td>
                    <td className="table-cell">{manager.email}</td>
                    <td className="table-cell">
                      {new Date(manager.dateOfJoining).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(manager, "manager")}
                        className="edit-button table-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(manager._id, "manager")}
                        className="delete-button table-button"
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

        <div className="list-section">
          <h4 className="list-title">Receptionists</h4>
          {!Array.isArray(receptionists) || receptionists.length === 0 ? (
            <p className="no-data-message">No receptionists found.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Date of Joining</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map((receptionist) => (
                  <tr key={receptionist._id}>
                    <td className="table-cell">{receptionist._id}</td>
                    <td className="table-cell">{receptionist.name}</td>
                    <td className="table-cell">{receptionist.email}</td>
                    <td className="table-cell">
                      {new Date(
                        receptionist.dateOfJoining
                      ).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleEdit(receptionist, "receptionist")}
                        className="edit-button table-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(receptionist._id, "receptionist")
                        }
                        className="delete-button table-button"
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
