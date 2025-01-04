import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Home Component
const Home = () => {
  const [roomData, setRoomData] = useState([]);
  const navigate = useNavigate();

  /*useEffect(() => {
    fetchRoomData();
  }, []);

  const fetchRoomData = async () => {
    try {
      const response = await axios.get("/api/rooms");
      setRoomData(response.data);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  };*/

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen text-gray-800">
      <div className="container mx-auto py-16">
        {/* Restro and Dining Data Section */}
        <div className="bg-blue-100 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Restro and Dining Data
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <img
                src="/deluxe-room.jpg"
                alt="Deluxe Room"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 font-bold">Breakfast</p>
            </div>
            <div className="text-center">
              <img
                src="/economic-room.jpg"
                alt="Economic Room"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 font-bold">Lunch</p>
            </div>
            <div className="text-center">
              <img
                src="/larger-than-life.jpg"
                alt="Larger Than Life Room"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 font-bold">Dining</p>
            </div>
            <div className="text-center">
              <img
                src="/larger-life.jpg"
                alt="Larger Life Room"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="mt-2 font-bold">Club-Holic</p>
            </div>
          </div>
        </div>

        {/* Room Types Section */}
        <div className="bg-purple-100 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Rooms and Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roomData.map((room) => (
              <div key={room.id} className="text-center">
                <img
                  src={room.imageUrl}
                  alt={room.type}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="mt-2 font-bold">{room.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Section */}
        <div className="bg-yellow-100 p-8 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-center mb-4">ADMIN</h3>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => navigate("/admin-login")}
            >
              Login as Admin
            </button>
          </div>
        </div>

        {/* Employee Section */}
        <div className="bg-teal-100 p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-4">Employee</h3>
          <div className="flex justify-center">
            <form className="space-x-4">
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                Login as Manager
              </button>
              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                Login as Receptionist
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
