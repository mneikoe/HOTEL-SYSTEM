import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./BookingDashboard.css";

// Socket connection
const socket = io("http://localhost:7001", { withCredentials: true });

const BookingDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    roomNumber: "",
    customerName: "",
    checkInDate: "",
    checkOutDate: "",
    price: 0,
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
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

    return () => {
      socket.off("rooms");
      socket.off("bookings");
    };
  }, []);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    socket.emit("createBooking", bookingForm);
    setBookingForm({
      roomNumber: "",
      customerName: "",
      checkInDate: "",
      checkOutDate: "",
      price: 0,
    });
  };

  const prefillBookingForm = (room) => {
    setBookingForm({
      roomNumber: room.roomNumber,
      price: room.price,
      customerName: "",
      checkInDate: "",
      checkOutDate: "",
    });
    setSelectedRoom(room);
    bookingSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Booking Dashboard</h2>

      {/* Display Rooms as Cards */}
      <div className="card-grid-section">
        {rooms.map((room) => (
          <div key={room._id} className="room-card">
            <img
              src={room.imageUrl}
              alt={room.roomNumber}
              className="room-image"
            />
            <div className="room-details">
              <h4>{room.roomNumber}</h4>
              <p>Price: ₹{room.price}/night</p>
              <p>Status: {room.status === "Booked" ? "Booked" : "Available"}</p>
              <button
                onClick={() => prefillBookingForm(room)}
                className="book-button"
                style={{ backgroundColor: "green", color: "white" }}
              >
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Section */}
      <div ref={bookingSectionRef} className="section booking-section">
        <h3 className="section-title">Book a Room</h3>
        {selectedRoom && (
          <div className="booking-container">
            <img
              src={selectedRoom.imageUrl}
              alt={selectedRoom.roomNumber}
              className="booking-image"
            />
            <form onSubmit={handleBookingSubmit} className="form-container">
              <input
                type="text"
                name="roomNumber"
                value={bookingForm.roomNumber}
                className="input-field"
                readOnly
              />
              <input
                type="text"
                name="customerName"
                onChange={handleBookingChange}
                placeholder="Customer Name"
                value={bookingForm.customerName}
                className="input-field"
                required
              />
              <input
                type="datetime-local"
                name="checkInDate"
                onChange={handleBookingChange}
                value={bookingForm.checkInDate}
                className="input-field"
                required
              />
              <input
                type="datetime-local"
                name="checkOutDate"
                onChange={handleBookingChange}
                value={bookingForm.checkOutDate}
                className="input-field"
                required
              />
              <p>Total Price: ₹{bookingForm.price}</p>
              <button type="submit" className="submit-button">
                Book Room
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDashboard;
