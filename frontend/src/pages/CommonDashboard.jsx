import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import RoomGrid from "./RoomGrid"; // Import the RoomGrid component

// Socket connection
const socket = io("http://localhost:7001", { withCredentials: true });

const CommonDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomData, setRoomData] = useState({
    id: "",
    type: "Economic",
    roomNumber: "",
    floorNumber: "",
    price: "",
    imageUrl: "",
    createdBy: {
      id: "",
      role: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get(
          "http://localhost:7001/api/rooms"
        );
        setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    socket.on("rooms", (data) => {
      setRooms(Array.isArray(data) ? data : []);
    });

    return () => {
      socket.off("rooms");
    };
  }, []);

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("createdBy.")) {
      setRoomData((prevData) => ({
        ...prevData,
        createdBy: {
          ...prevData.createdBy,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setRoomData({ ...roomData, [name]: value });
    }
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    //const shortType = roomData.type.substring(0, 3).toUpperCase();
    //const generatedRoomNumber = `${shortType}-${roomData.roomNumber}-${roomData.floorNumber}`;

    const updatedRoomData = { ...roomData, roomNumber: roomData.roomNumber };
    const endpoint = roomData.id ? "updateRoom" : "createRoom";
    socket.emit(endpoint, updatedRoomData);
    setRoomData({
      id: "",
      type: "Economic",
      roomNumber: "",
      floorNumber: "",
      price: "",
      imageUrl: "",
      createdBy: {
        id: "",
        role: "",
      },
    });
  };

  const handleRoomDelete = (id) => {
    socket.emit("deleteRoom", id);
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

  const toggleDropdown = (roomId) => {
    document.getElementById(roomId).classList.toggle("active");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="text-4xl font-bold text-center mb-10 text-white">
        Common Dashboard
      </h2>
      <div className="flex justify-between mb-8">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Logout
        </button>
        <button
          onClick={() => navigate("/booking-dashboard")}
          className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Booking Dashboard
        </button>
      </div>

      <RoomGrid
        rooms={rooms}
        handleRoomDelete={handleRoomDelete}
        toggleDropdown={toggleDropdown}
      />

      <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-10 border border-white/10 transition-transform duration-300 w-full mt-20">
        <h3 className="text-3xl font-semibold text-center mb-6 text-black">
          Room Management
        </h3>
        <form
          onSubmit={handleRoomSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 "
        >
          <input
            type="text"
            name="floorNumber"
            onChange={handleRoomChange}
            placeholder="Floor Number"
            value={roomData.floorNumber}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="text"
            name="roomNumber"
            onChange={handleRoomChange}
            placeholder="Room Number"
            value={roomData.roomNumber}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="number"
            name="price"
            onChange={handleRoomChange}
            placeholder="Price"
            value={roomData.price}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="text"
            name="imageUrl"
            onChange={handleRoomChange}
            placeholder="Image URL"
            value={roomData.imageUrl}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <input
            type="text"
            name="createdBy.id"
            onChange={handleRoomChange}
            placeholder="Created By ID"
            value={roomData.createdBy.id}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <input
            type="text"
            name="createdBy.role"
            onChange={handleRoomChange}
            placeholder="Created By Role"
            value={roomData.createdBy.role}
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
            required
          />
          <div className="col-span-1 md:col-span-2 flex items-center justify-center mb-6">
            <select
              name="type"
              onChange={handleRoomChange}
              value={roomData.type}
              className="p-3 border border-gray-300 rounded-lg shadow-sm"
              required
            >
              <option value="Economic">Economic</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Super Deluxe">Super Deluxe</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg w-full md:col-span-2 transition-transform transform hover:scale-105"
          >
            {roomData.id ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommonDashboard;
