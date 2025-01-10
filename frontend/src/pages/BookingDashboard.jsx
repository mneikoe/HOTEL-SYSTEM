import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

// Socket connection
const socket = io("http://localhost:7001", { withCredentials: true });

const BookingDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    roomNumber: "",
    customerName: "",
    checkInDate: "",
    checkOutDate: "",
    price: 0,
    totalCost: 0,
    createdBy: { id: "", role: "" }, // Adjust dynamically if needed
  });

  const bookingSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsResponse = await axios.get("/api/rooms");
        const bookingsResponse = await axios.get("/api/bookings");
        setRooms(Array.isArray(roomsResponse.data) ? roomsResponse.data : []);
        setBookings(
          Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    socket.on("rooms", (data) => {
      setRooms(Array.isArray(data) ? data : []);
    });

    socket.on("bookings", (data) => {
      setBookings(Array.isArray(data) ? data : []);
    });

    socket.on("newBooking", (booking) => {
      setBookings((prevBookings) => [...prevBookings, booking]);
    });

    socket.on("bookingCancelled", (booking) => {
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b._id === booking._id ? booking : b))
      );
    });

    socket.on("bookingCompleted", (booking) => {
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b._id === booking._id ? booking : b))
      );
    });

    socket.emit("ready", "common"); // Notify server that this is the common dashboard

    return () => {
      socket.off("rooms");
      socket.off("bookings");
      socket.off("newBooking");
      socket.off("bookingCancelled");
      socket.off("bookingCompleted");
    };
  }, []);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      const totalCost =
        bookingForm.price * Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const bookingData = {
        roomNumber: bookingForm.roomNumber,
        customerName: bookingForm.customerName,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        totalCost,
        createdBy: bookingForm.createdBy,
      };

      // Ensure the API URL is correct
      await axios.post("http://localhost:7001/api/bookings", bookingData);

      setBookingForm({
        roomNumber: "",
        customerName: "",
        checkInDate: "",
        checkOutDate: "",
        price: 0,
        totalCost: 0,
        createdBy: {
          id: bookingForm.createdBy.id,
          role: bookingForm.createdBy.role,
        }, // Adjust dynamically if needed
      });
    } catch (error) {
      console.error("Error booking room:", error);
    }
  };

  const prefillBookingForm = (room) => {
    setBookingForm({
      roomNumber: room.roomNumber,
      price: room.price,
      customerName: "",
      checkInDate: "",
      checkOutDate: "",
      totalCost: 0,
      createdBy: {
        id: bookingForm.createdBy.id,
        role: bookingForm.createdBy.role,
      }, // Adjust dynamically if needed
    });
    setSelectedRoom(room);
    bookingSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const calculatePrice = (roomPrice, checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return roomPrice * diffDays;
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center bg-gray-200 min-h-screen p-5">
      <h2 className="text-4xl text-gray-800 mb-5 text-center">
        Booking Dashboard
      </h2>

      <button
        onClick={() => navigate("/")}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-800 mb-3"
      >
        Back to home
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={room.imageUrl}
              alt={room.roomNumber}
              className="w-full object-cover h-48"
            />
            <div className="p-4">
              <h4 className="text-lg font-bold">{room.roomNumber}</h4>
              <p>Price: ₹{room.price}/night</p>
              <p>Status: {room.status === "Booked" ? "Booked" : "Available"}</p>
              <button
                onClick={() => prefillBookingForm(room)}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800 w-full mt-2"
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        ref={bookingSectionRef}
        className="bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-4xl mt-5"
      >
        <h3 className="text-2xl text-gray-800 mb-4">Book a Room</h3>
        {selectedRoom && (
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={selectedRoom.imageUrl}
              alt={selectedRoom.roomNumber}
              className="booking-image md:w-1/2 mb-4 md:mb-0 rounded-lg shadow-lg"
            />
            <form
              onSubmit={handleBookingSubmit}
              className="flex flex-col items-center md:w-1/2"
            >
              <input
                type="text"
                name="roomNumber"
                value={bookingForm.roomNumber}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                readOnly
              />
              <input
                type="text"
                name="customerName"
                onChange={handleBookingChange}
                placeholder="Customer Name"
                value={bookingForm.customerName}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                required
              />
              <input
                type="datetime-local"
                name="checkInDate"
                onChange={handleBookingChange}
                value={bookingForm.checkInDate}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                required
              />
              <input
                type="datetime-local"
                name="checkOutDate"
                onChange={handleBookingChange}
                value={bookingForm.checkOutDate}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                required
              />
              <input
                type="text"
                name="id"
                onChange={handleBookingChange}
                value={bookingForm.createdBy.id}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                required
              />
              <input
                type="text"
                name="Role"
                onChange={handleBookingChange}
                value={bookingForm.createdBy.role}
                className="input-field w-full py-2 px-4 mb-2 border rounded"
                required
              />
              <p className="text-gray-700 mb-2">
                Total Price: ₹
                {calculatePrice(
                  bookingForm.price,
                  bookingForm.checkInDate,
                  bookingForm.checkOutDate
                )}
              </p>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800 w-full"
                onClick={() => handleBookingSubmit}
              >
                Book Room
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-lg w/full max-w-4xl mt-5">
        <h3 className="text-2xl text-gray-800 mb-4">Current Bookings</h3>
        {!Array.isArray(bookings) || bookings.length === 0 ? (
          <p className="text-gray-700">No bookings found.</p>
        ) : (
          <table className="w/full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Room Number</th>
                <th className="py-2 px-4 border-b">Customer Name</th>
                <th className="py-2 px-4 border-b">Check-In Date</th>
                <th className="py-2 px-4 border-b">Check-Out Date</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Total Cost</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Created By</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="py-1 px-4 border-b">{booking.roomNumber}</td>
                  <td className="py-1 px-4 border-b">{booking.customerName}</td>
                  <td className="py-1 px-4 border-b">
                    {new Date(booking.checkInDate).toLocaleString()}
                  </td>
                  <td className="py-1 px-4 border-b">
                    {new Date(booking.checkOutDate).toLocaleString()}
                  </td>
                  <td className="py-1 px-4 border-b">₹{booking.price}</td>
                  <td className="py-1 px-4 border-b">₹{booking.totalCost}</td>
                  <td className="py-1 px-4 border-b">
                    {booking.bookingStatus}
                  </td>
                  <td className="py-1 px-4 border-b">
                    {booking.createdBy.id} ({booking.createdBy.role})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;

/*import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:7001");

const BookingDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [notification, setNotification] = useState(null);
  const bookingFormRef = useRef(null);

  const [formData, setFormData] = useState({
    roomId: "",
    customerName: "",
    checkInDate: "",
    checkOutDate: "",
    createdBy: {
      id: "user123",
      role: "receptionist",
    },
  });

  useEffect(() => {
    socket.on("bookingUpdate", handleBookingUpdate);
    return () => {
      socket.off("bookingUpdate", handleBookingUpdate);
    };
  }, []);

  const handleBookingUpdate = (update) => {
    try {
      setNotification(
        `New booking ${update.type}: ${update.booking.customerName}`
      );
    } catch (error) {
      setErr("Error handling booking update");
    } finally {
      fetchBookings(); // Refresh bookings
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:7001/api/rooms");
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      setErr("Failed to fetch rooms");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:7001/api/bookings");
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
      setLoading(false);
    } catch (error) {
      setErr("Failed to fetch bookings");
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:7001/api/bookings",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setNotification("Booking created successfully");
        setFormData({
          roomId: "",
          customerName: "",
          checkInDate: "",
          checkOutDate: "",
          createdBy: {
            id: "user123",
            role: "receptionist",
          },
        });
      } else {
        setErr(response.data.error);
      }
    } catch (error) {
      setErr("Failed to create booking");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        `http://localhost:7001/api/bookings/${bookingId}/cancel`
      );
      if (response.data.success) {
        fetchBookings();
        setNotification("Booking canceled successfully");
      } else {
        setErr(response.data.error);
      }
    } catch (error) {
      setErr("Failed to cancel booking");
    }
  };

  const handleBookNow = (roomId) => {
    setFormData((prev) => ({
      ...prev,
      roomId,
    }));
    bookingFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        Hotel Booking System
      </h1>

      {notification && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px",
            border: "1px solid green",
            backgroundColor: "#e6ffe6",
          }}
        >
          {notification}
        </div>
      )}

      {err && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px",
            border: "1px solid red",
            backgroundColor: "#ffe6e6",
          }}
        >
          {err}
        </div>
      )}

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Available Rooms
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={`path_to_room_images/${room._id}.jpg`}
                alt="Room"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Room {room.roomNumber}
              </div>
              <div
                style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}
              >
                {room.type}
              </div>
              <button
                onClick={() => handleBookNow(room._id)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={bookingFormRef}
        style={{
          marginBottom: "32px",
          padding: "20px",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Create Booking
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Room
            </label>
            <select
              name="roomId"
              value={formData.roomId}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            >
              <option value="">Select a room</option>
              {rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomNumber} - {room.type}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px" }}>
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Check-in Date
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px" }}>
                Check-out Date
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "#007bff",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Create Booking
          </button>
        </form>
      </div>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          backgroundColor: "#fff",
          borderRadius: "8px",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}
        >
          Current Bookings
        </h2>
        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f7f7f7" }}>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Room
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Check-in
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Check-out
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={{ padding: "8px" }}>
                      {booking.roomId?.roomNumber}
                    </td>
                    <td style={{ padding: "8px" }}>{booking.customerName}</td>
                    <td style={{ padding: "8px" }}>
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "8px" }}>{booking.bookingStatus}</td>
                    <td style={{ padding: "8px" }}>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        style={{
                          color: "red",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;*/
