import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CommonDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/api/manager/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Common Dashboard</h1>
      <div className="flex justify-around mb-8">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/admin-login")}
        >
          Login as Admin
        </button>
        <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/manager-login")}
        >
          Login as Manager
        </button>
        <button
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/receptionist-login")}
        >
          Login as Receptionist
        </button>
      </div>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Rooms</h2>
        <ul>
          {rooms.map((room) => (
            <li key={room._id}>
              {room.roomNumber} - {room.roomType} - {room.status} - $
              {room.price}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default CommonDashboard;
