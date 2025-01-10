import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

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
    const shortType = roomData.type.substring(0, 3).toUpperCase();
    const generatedRoomNumber = `${shortType}-${roomData.roomNumber}-${roomData.floorNumber}`;

    const updatedRoomData = { ...roomData, roomNumber: generatedRoomNumber };
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
    <div className="flex flex-col items-center bg-gray-200 min-h-screen p-5">
      <h2 className="text-4xl text-gray-800 mb-5 text-center">
        Common Dashboard
      </h2>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 mb-3"
      >
        Logout
      </button>

      <button
        onClick={() => navigate("/booking-dashboard")}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 mb-3"
      >
        Booking Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {rooms.map((room) => (
          <div
            key={room._id}
            id={room._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={room.imageUrl}
              alt={room.roomNumber}
              className="w-full object-cover h-48"
            />
            <button
              onClick={() => toggleDropdown(room._id)}
              className="bg-green-600 text-white py-2 px-4 w-full hover:bg-green-800"
            >
              {room.roomNumber} Details
            </button>
            <div className="room-details p-4 flex flex-col items-start">
              <h4 className="text-lg font-bold">{room.type}</h4>
              <p>Room: {room.roomNumber}</p>
              <p>Floor: {room.floorNumber}</p>
              <p>Price: ₹{room.price}/night</p>
              <p>
                Created By: {room.createdBy.id} ({room.createdBy.role})
              </p>
              <div className="flex w-full">
                <button
                  onClick={() => handleRoomDelete(room._id)}
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-800 mr-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-4xl mt-5">
        <h3 className="text-2xl text-gray-800 mb-4">Room Management</h3>
        <form
          onSubmit={handleRoomSubmit}
          className="flex flex-col items-center"
        >
          <input
            type="text"
            name="floorNumber"
            onChange={handleRoomChange}
            placeholder="Floor Number"
            value={roomData.floorNumber}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="roomNumber"
            onChange={handleRoomChange}
            placeholder="Room Number"
            value={roomData.roomNumber}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
            required
          />
          <input
            type="number"
            name="price"
            onChange={handleRoomChange}
            placeholder="Price"
            value={roomData.price}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="imageUrl"
            onChange={handleRoomChange}
            placeholder="Image URL"
            value={roomData.imageUrl}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
          />
          <input
            type="text"
            name="createdBy.id"
            onChange={handleRoomChange}
            placeholder="Created By ID"
            value={roomData.createdBy.id}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
            required
          />
          <input
            type="text"
            name="createdBy.role"
            onChange={handleRoomChange}
            placeholder="Created By Role"
            value={roomData.createdBy.role}
            className="input-field py-2 px-4 mb-2 border rounded w-full"
            required
          />
          <div className="flex items-center mb-4 w-full">
            <label className="font-bold mr-4">Type</label>
            <select
              name="type"
              onChange={handleRoomChange}
              value={roomData.type}
              className="input-field py-2 px-4 border rounded w-full"
              required
            >
              <option value="Economic">Economic</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Super Deluxe">Super Deluxe</option>
              <option value="Larger than Life">Larger than Life</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 w-full"
          >
            {roomData.id ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommonDashboard;
