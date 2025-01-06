import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [roomData, setRoomData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("/api/rooms");
        setRoomData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();
  }, []);

  return (
    <div className="home-container">
      {/* Restro and Dining Data Section */}
      <section className="section bg-blue-100">
        <h2 className="section-title">Restro and Dining Data</h2>
        <div className="section-content">
          <div className="inline-card" onClick={() => navigate("/breakfast")}>
            <img
              src="/deluxe-room.jpg"
              alt="Deluxe Room"
              className="card-img"
            />
            <p className="card-title">Breakfast</p>
          </div>
          <div className="inline-card" onClick={() => navigate("/lunch")}>
            <img
              src="/economic-room.jpg"
              alt="Economic Room"
              className="card-img"
            />
            <p className="card-title">Lunch</p>
          </div>
          <div className="inline-card" onClick={() => navigate("/dining")}>
            <img
              src="/larger-than-life.jpg"
              alt="Larger Than Life Room"
              className="card-img"
            />
            <p className="card-title">Dining</p>
          </div>
          <div className="inline-card" onClick={() => navigate("/club-holic")}>
            <img
              src="/larger-life.jpg"
              alt="Larger Life Room"
              className="card-img"
            />
            <p className="card-title">Club-Holic</p>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section className="section bg-purple-100">
        <h2 className="section-title">Rooms and Types</h2>
        <div className="section-content">
          {roomData.length > 0 ? (
            roomData.map((room) => (
              <div key={room.id} className="inline-card">
                <img src={room.imageUrl} alt={room.type} className="card-img" />
                <p className="card-title">{room.type}</p>
              </div>
            ))
          ) : (
            <p>No rooms available.</p>
          )}
        </div>
      </section>

      {/* Admin Section */}
      <section className="section bg-yellow-100">
        <h2 className="section-title">ADMIN</h2>
        <div className="section-content">
          <button
            className="btn-primary"
            onClick={() => navigate("/admin-login")}
          >
            Login as Admin
          </button>
        </div>
      </section>

      {/* Employee Section */}
      <section className="section bg-teal-100">
        <h2 className="section-title">Employee</h2>
        <div className="section-content">
          <button
            className="btn-primary"
            onClick={() => navigate("/manager-login")}
          >
            Login as Manager
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate("/receptionist-login")}
          >
            Login as Receptionist
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
