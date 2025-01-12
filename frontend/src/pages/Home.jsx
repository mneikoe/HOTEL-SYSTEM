/*import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomData, setRoomData] = useState([]);
  const [currentImages, setCurrentImages] = useState({
    Economic: 0,
    Deluxe: 0,
    "Super Deluxe": 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get("http://localhost:7001/api/rooms");
        setRoomData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchRoomData();

    const intervals = {
      Economic: setInterval(() => updateImage("Economic"), 2000),
      Deluxe: setInterval(() => updateImage("Deluxe"), 2000),
      "Super Deluxe": setInterval(() => updateImage("Super Deluxe"), 2000),
    };

    return () => Object.values(intervals).forEach(clearInterval);
  }, []);

  const updateImage = (type) => {
    setCurrentImages((prevImages) => ({
      ...prevImages,
      [type]: (prevImages[type] + 1) % getRoomImagesByType(type).length,
    }));
  };

  const getRoomImagesByType = (type) => {
    return roomData
      .filter((room) => room.type === type)
      .map((room) => room.imageUrl);
  };

  const getRoomImage = (type) => {
    const images = getRoomImagesByType(type);
    return images[currentImages[type] % images.length] || "";
  };

  return (
    <div
      className="home-container flex flex-col items-center bg-cover bg-center text-white font-open-sans"
      style={{
        backgroundImage:
          "url('https://vintage-vail.com/wp-content/uploads/2015/07/vintage-9423_lo-res.jpg')",
      }}
    >
      
      <div className="overlay bg-black bg-opacity-30 w-full h-full absolute"></div>
      <div className="content-container relative z-10 w-full max-w-4xl p-4">
        {/* Room Types Section 
        <section className="section bg-white bg-opacity-90 w-full py-8 px-6 rounded-lg shadow-lg mb-6">
          <h2 className="section-title text-3xl font-bold text-center pb-6 font-lato text-gray-800">
            Rooms and Types
          </h2>
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Economic", "Deluxe", "Super Deluxe"].map((type) => (
              <div
                key={type}
                className="inline-card bg-white rounded-lg shadow-lg p-6"
              >
                <img
                  src={getRoomImage(type)}
                  alt={type}
                  className="card-img w-full h-48 object-cover rounded-t-lg"
                />
                <p className="card-title text-center mt-4 text-gray-800">
                  {type}
                </p>
              </div>
            ))}
          </div>
        </section>

        
        <section className="section bg-white bg-opacity-90  w-full py-8 px-6 rounded-lg shadow-lg mb-6">
          <div>
            <h2 className="section-title text-3xl font-bold text-center pb-6 font-lato text-gray-800">
              Restro and Dining Data
            </h2>
          </div>
          <div className="section-content grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="inline-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              //onClick={() => navigate("/breakfast")}
            >
              <img
                src="https://i.pinimg.com/originals/3f/75/35/3f75356b5be466197bd7fa6baddd83b6.jpg"
                alt="Breakfast"
                className="card-img w-full h-56 object-cover rounded-t-lg"
              />
              <p className="card-title text-center mt-4 text-gray-800">
                Breakfast
              </p>
            </div>
            <div
              className="inline-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              // onClick={() => navigate("/lunch")}
            >
              <img
                src="https://vintage-vail.com/wp-content/uploads/2015/07/vintage-9423_lo-res.jpg"
                alt="Lunch"
                className="card-img w-full h-56 object-cover rounded-t-lg"
              />
              <p className="card-title text-center mt-4 text-gray-800">
                Hang-out
              </p>
            </div>
            <div
              className="inline-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              //onClick={() => navigate("/dining")}
            >
              <img
                src="https://images3.alphacoders.com/677/677816.jpg"
                alt="dinning"
                className="card-img w-full h-56 object-cover rounded-t-lg"
              />
              <p className="card-title text-center mt-4 text-gray-800">
                Dining
              </p>
            </div>
            <div
              className="inline-card bg-white rounded-lg shadow-lg p-6 flex flex-col items-center"
              //onClick={() => navigate("/club-holic")}
            >
              <img
                src="https://assets.simpleviewcms.com/simpleview/image/fetch/c_limit,h_1200,q_75,w_1200/https://lasvegas.simpleviewcrm.com/images/listings/original_drais-nightclub_8E831258-9254-D09F-2F9DE9444833E3DB-8e8310f9f219fae.jpg"
                alt="Club"
                className="card-img w-full h-56 object-cover rounded-t-lg"
              />
              <p className="card-title text-center mt-4 text-gray-800">
                Club-Holic
              </p>
            </div>
          </div>
        </section>

      
        <section className="section bg-white bg-opacity-90 w-full py-4 px-6 rounded-lg shadow-lg mb-6">
          <h2 className="section-title text-2xl font-bold text-center pb-2 font-lato text-gray-800">
            ADMIN
          </h2>
          <div className="section-content flex justify-center">
            <button
              className="btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => navigate("/admin-login")}
            >
              Login as Admin
            </button>
          </div>
        </section>
    
        <section className="section bg-white bg-opacity-90 w-full py-4 px-6 rounded-lg shadow-lg mb-6">
          <h2 className="section-title text-2xl font-bold text-center pb-2 font-lato text-gray-800">
            Employee
          </h2>
          <div className="section-content flex justify-center space-x-4">
            <button
              className="btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => navigate("/manager-login")}
            >
              Login as Manager
            </button>
            <button
              className="btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
              onClick={() => navigate("/receptionist-login")}
            >
              Login as Receptionist
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [currentImages, setCurrentImages] = useState({
    Economic: 0,
    Deluxe: 0,
    "Super Deluxe": 0,
  });
  const navigate = useNavigate();

  // Static room images for each type
  const roomImages = {
    Economic: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    Deluxe: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
    "Super Deluxe": [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      "https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    ],
  };

  useEffect(() => {
    const intervals = {
      Economic: setInterval(() => updateImage("Economic"), 2000),
      Deluxe: setInterval(() => updateImage("Deluxe"), 2000),
      "Super Deluxe": setInterval(() => updateImage("Super Deluxe"), 2000),
    };

    return () => Object.values(intervals).forEach(clearInterval);
  }, []);

  const updateImage = (type) => {
    setCurrentImages((prevImages) => ({
      ...prevImages,
      [type]: (prevImages[type] + 1) % roomImages[type].length,
    }));
  };

  const getRoomImage = (type) => {
    return roomImages[type][currentImages[type]];
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col space-y-12">
        {/* Room Types Section */}
        <section className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="backdrop-blur-md bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl shadow-2xl p-10 border border-white/10">
            <h2 className="text-4xl font-bold text-center mb-10 text-white">
              Luxurious Accommodations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {["Economic", "Deluxe", "Super Deluxe"].map((type) => (
                <div
                  key={type}
                  className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={getRoomImage(type)}
                      alt={type}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {type}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dining & Entertainment Section */}
        <section className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl shadow-2xl p-10 border border-white/10">
            <h2 className="text-4xl font-bold text-center mb-10 text-white">
              Dining & Entertainment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Breakfast",
                  image:
                    "https://images.unsplash.com/photo-1496412705862-e0088f16f791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                },
                {
                  title: "Hang-out",
                  image:
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                },
                {
                  title: "Dining",
                  image:
                    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                },
                {
                  title: "Club-Holic",
                  image:
                    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
                },
              ].map(({ title, image }) => (
                <div
                  key={title}
                  className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">
                      {title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Admin Section */}
        <section className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="backdrop-blur-md bg-gradient-to-r from-pink-500/10 to-indigo-500/10 rounded-3xl shadow-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Administration
            </h2>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/admin-login")}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 border border-white/10"
              >
                Login as Admin
              </button>
            </div>
          </div>
        </section>

        {/* Employee Section */}
        <section className="transform hover:scale-[1.01] transition-transform duration-300">
          <div className="backdrop-blur-md bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl shadow-2xl p-8 border border-white/10">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">
              Employee Portal
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/manager-login")}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 border border-white/10"
              >
                Login as Manager
              </button>
              <button
                onClick={() => navigate("/receptionist-login")}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold transform hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:from-purple-600 hover:to-pink-600 border border-white/10"
              >
                Login as Receptionist
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
