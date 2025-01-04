import { useState, useEffect } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    roomType: "",
    status: "",
    price: "",
  });
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/manager/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const addRoom = async () => {
    try {
      await axios.post("/api/manager/rooms", newRoom);
      fetchRooms();
      setNewRoom({ roomNumber: "", roomType: "", status: "", price: "" });
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  const updateRoom = async () => {
    try {
      await axios.put(`/api/manager/rooms/${editingRoom._id}`, newRoom);
      fetchRooms();
      setEditingRoom(null);
      setNewRoom({ roomNumber: "", roomType: "", status: "", price: "" });
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  const deleteRoom = async (id) => {
    try {
      await axios.delete(`/api/manager/rooms/${id}`);
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setNewRoom({ ...room });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              {room.roomNumber} - {room.roomType} - {room.status} - $
              {room.price}
              <button
                onClick={() => handleEdit(room)}
                className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteRoom(room._id)}
                className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          {editingRoom ? "Edit Room" : "Add Room"}
        </h2>
        <input
          type="text"
          name="roomNumber"
          placeholder="Room Number"
          value={newRoom.roomNumber}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
        />
        <input
          type="text"
          name="roomType"
          placeholder="Room Type"
          value={newRoom.roomType}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
        />
        <input
          type="text"
          name="status"
          placeholder="Room Status"
          value={newRoom.status}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Room Price"
          value={newRoom.price}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2"
        />
        <button
          onClick={editingRoom ? updateRoom : addRoom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
      </section>
    </div>
  );
};

export default ManagerDashboard;
