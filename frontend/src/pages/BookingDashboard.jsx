/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { ArrowLeft } from "lucide-react";
import { parse } from "date-fns"; // Using date-fns for date handling
import { DownloadTableExcel } from "react-export-table-to-excel";

// Initialize Socket.IO
const socket = io("https://www.indigaapi.atithikripa.com");
socket.on("connect", () => {
  console.log("WebSocket connected");
});

const BookingDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [newCheckoutDateTime, setNewCheckoutDateTime] = useState(null);

  const tableRef = useRef(null);

  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    customerPhone: "",
    customerAdharId: "",
    customerAddress: "",
    NumberOfPeople: "",
    checkInDateTime: "",
    checkOutDateTime: "",
    sellingPricePerDay: "",
    advanceAmount: "",
  });

  const bookingSectionRef = useRef(null);
  const navigate = useNavigate();

  // **Socket and Data Fetching Setup**
  useEffect(() => {
    socket.on("rooms", (data) => setRooms(Array.isArray(data) ? data : []));
    socket.on("bookings", (data) =>
      setBookings(Array.isArray(data) ? data : [])
    );
    socket.on("bookingUpdate", (update) => {
      showNotification(
        "success",
        `Booking ${update.type}: ${update.booking.customerName}`
      );
      fetchBookings();
    });

    fetchRooms();
    fetchBookings();

    return () => {
      socket.off("rooms");
      socket.off("bookings");
      socket.off("bookingUpdate");
    };
  }, []);

  // **Fetch Room Data**
  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        "https://www.indigaapi.atithikripa.com/api/rooms"
      );
      if (response.data.success) setRooms(response.data.rooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      showNotification("error", "Failed to fetch rooms");
    }
  };

  // **Fetch Booking Data**
  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        "https://www.indigaapi.atithikripa.com/api/bookings"
      );
      if (response.data.success) setBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      showNotification("error", "Failed to fetch bookings");
    }
  };
  const totalCost = () => {
    const checkIn = new Date(bookingForm.checkInDateTime);
    const checkOut = new Date(bookingForm.checkOutDateTime);
    const durationInHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const pricePerHour = Math.ceil(selectedRoom.price / 24);

    if (durationInHours > 18) {
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return days * selectedRoom.price;
    } else {
      return Math.ceil(durationInHours) * pricePerHour;
    }
  };
  const sellingPrice = () => {
    const checkIn = new Date(bookingForm.checkInDateTime);
    const checkOut = new Date(bookingForm.checkOutDateTime);
    const durationInHours = (checkOut - checkIn) / (1000 * 60 * 60);
    const pricePerHour = Math.ceil(bookingForm.sellingPricePerDay / 24);

    if (durationInHours > 18) {
      const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return days * bookingForm.sellingPricePerDay;
    } else {
      return Math.ceil(durationInHours) * pricePerHour;
    }
  };
  const balanceAmount = () => {
    const a = bookingForm.advanceAmount;
    const b = sellingPrice();
    if (b > a) {
      const due = b - a;
      return due;
    } else {
      const due = b - a;
      return due;
    }
  };

  // **Submit Booking**
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Emit new booking through Socket.IO

    // Validate form fields
    if (
      !bookingForm.customerName ||
      !bookingForm.customerPhone ||
      !bookingForm.customerAdharId ||
      !bookingForm.checkInDateTime ||
      !bookingForm.checkOutDateTime ||
      !bookingForm.sellingPricePerDay ||
      !bookingForm.advanceAmount ||
      !selectedRoom
    ) {
      showNotification("error", "Please fill in all required fields");
      return;
    }

    try {
      const checkIn = parse(
        bookingForm.checkInDateTime,
        "yyyy-MM-dd",
        new Date()
      );
      const checkout = parse(
        bookingForm.checkOutDateTime,
        "yyyy-MM-dd",
        new Date()
      );

      totalCost();
      balanceAmount();
      sellingPrice();

      const response = await axios.post(
        "https://www.indigaapi.atithikripa.com/api/bookings",
        {
          roomNumber: selectedRoom.roomNumber,
          customerName: bookingForm.customerName,
          customerPhone: bookingForm.customerPhone,
          customerAdharId: bookingForm.customerAdharId,
          customerAddress: bookingForm.customerAddress,
          NumberOfPeople: bookingForm.NumberOfPeople,
          checkInDateTime: bookingForm.checkInDateTime,
          checkOutDateTime: bookingForm.checkOutDateTime,
          advanceAmount: bookingForm.advanceAmount,
          sellingPricePerDay: bookingForm.sellingPricePerDay,

          balanceAmount: balanceAmount,

          totalCost: totalCost,
          sellingPrice: sellingPrice,
        }
      );

      if (response.data.success) {
        showNotification("success", "Booking created successfully");

        // Emit the new booking to other clients
        socket.emit("newBooking", response.data.booking);

        // Clear form fields after submission
        setBookingForm({
          customerName: "",
          customerPhone: "",
          customerAdharId: "",
          customerAddress: "",
          NumberOfPeople: "",
          checkInDateTime: "",
          checkOutDateTime: "",
          advanceAmount: "",
          sellingPricePerDay: "",
        });
        setSelectedRoom(null);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      showNotification("error", "Failed to create booking");
    }
  };

  // **Show Notifications**
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // **Select Room**
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEarlyCheckout = async (
    bookingId,
    newCheckoutDateTime,
    amountReceived
  ) => {
    try {
      const response = await axios.post(
        "https://www.indigaapi.atithikripa.com/api/bookings/earlyCheckout/${bookingId}",
        { newCheckoutDateTime },
        { amountReceived }
      );

      if (response.data.success) {
        showNotification("success", "Early checkout processed successfully.");
        fetchBookings();
        fetchRooms();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Failed to process early checkout:", error);
      showNotification("error", "Failed to process early checkout.");
    }
  };
  const handlefinalCheckout = async (bookingId) => {
    try {
      const response = await axios.post(
        "https://www.indigaapi.atithikripa.com/api/bookings/finalCheckout/${bookingId}"
      );

      if (response.data.success) {
        showNotification("success", "final checkout processed successfully.");
        fetchBookings();
        fetchRooms();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Failed to process final checkout:", error);
      showNotification("error", "Failed to process final checkout.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        "https://www.indigaapi.atithikripa.com/api/bookings/${bookingId}/cancel"
      );
      if (response.data.success) {
        showNotification("success", "Booking cancelled successfully");
        fetchBookings();
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      showNotification("error", "Failed to cancel booking");
    }
  };

  // **UI Components**
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
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-100">Booking Dashboard</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-red-500 text-white text-xs  px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Home
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* Room List */}
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => {
            // Find the booking that matches the room number and has a status of booked

            return (
              <div
                key={room.id}
                className="group text-xs rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={`Room ${room.roomNumber}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-200">
                    Room {room.roomNumber}
                  </h3>
                  <p className="text-gray-200">{room.type}</p>
                  <p className="text-xs font-bold text-gray-200">
                    ₹{room.price}/night
                  </p>
                  <button
                    onClick={() => handleRoomSelect(room)}
                    disabled={room.isBooked}
                    className={`w-full mt-4 px-4 py-2 ${
                      room.isBooked
                        ? "bg-gray-200 text-gray-500 rounded-lg"
                        : "bg-red-500 text-white px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    }`}
                  >
                    {room.isBooked ? "Not Available" : "Book Now"}
                  </button>

                  {/* Display the Early Checkout button if the room is booked */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Form */}
        {selectedRoom && (
          <div
            ref={bookingSectionRef}
            className="mt-12 bg-gradient-to-r from-purple-500/10 backdrop-blur-lg  rounded-lg shadow-xl p-6 flex flex-col md:flex-row md:space-x-6"
          >
            <div className="flex-1">
              <h2 className="text-sm font-bold text-indigo-400 mb-6">
                Book Room {selectedRoom.roomNumber}
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customerName}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerName: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customerPhone}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerPhone: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Customer Adhar
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customerAdharId}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerAdharId: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Customer Address
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customerAddress}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        customerAddress: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Number Of People
                  </label>
                  <input
                    type="text"
                    value={bookingForm.NumberOfPeople}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        NumberOfPeople: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Check-in Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingForm.checkInDateTime}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        checkInDateTime: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Check-out Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={bookingForm.checkOutDateTime}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        checkOutDateTime: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Selling Price Per Night
                  </label>
                  <input
                    type="text"
                    value={bookingForm.sellingPricePerDay}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        sellingPricePerDay: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-100">
                    Advance Paid
                  </label>
                  <input
                    type="text"
                    value={bookingForm.advanceAmount}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        advanceAmount: e.target.value,
                      })
                    }
                    className="w-full bg-gray-400 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition duration-200"
                >
                  Confirm Booking
                </button>
              </form>
              <p className="mt-4 text-lg text-indigo-600">
                Total Cost: ₹
                {bookingForm.checkInDateTime && bookingForm.checkOutDateTime
                  ? totalCost()
                  : 0}
              </p>
              <p className="mt-4 text-lg text-indigo-600">
                Total sellingPrice: ₹
                {bookingForm.checkInDateTime && bookingForm.checkOutDateTime
                  ? sellingPrice()
                  : 0}
              </p>
            </div>
            <div className="flex-1 mt-6 md:mt-0">
              <h3 className="text-sm font-bold text-indigo-400 mb-4">
                Room Image
              </h3>
              <img
                src={selectedRoom.imageUrl} // Ensure selectedRoom has an imageUrl property
                alt={`Room ${selectedRoom.roomNumber}`}
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <p className="mt-4 text-gray-100">
                Room Type: {selectedRoom.type}
              </p>
              <p className="text-gray-100">
                Price: ₹{selectedRoom.price}/night
              </p>
            </div>
          </div>
        )}
        <div>
          <DownloadTableExcel
            filename="users table"
            sheet="users"
            currentTableRef={tableRef.current}
          >
            <button className="bg-blue-500  text-xs text-white px-6 py-2 rounded-lg mt-10 shadow-lg transition-transform transform hover:scale-105">
              Export to Excel
            </button>
          </DownloadTableExcel>
        </div>
        {/* Bookings */}
        <div className="w-full max-w-5xl  bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg shadow-xl rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-7">Bookings</h2>
          <table
            className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 w-full"
            ref={tableRef}
          >
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-black bg-gray-100">
                  Booking Id
                </th>

                <th className="px-4 py-3 text-xs font-medium text-black bg-gray-100">
                  Customer details
                </th>
                <th className="px-4 py-3 text-xs font-medium text-black bg-gray-100">
                  Activities
                </th>

                <th className="px-4 py-3 text-xs font-medium text-black bg-gray-100">
                  Transactions
                </th>

                <th className="px-4 py-3 text-xs font-medium text-black bg-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-3 border text-xs text-white ">
                    <ul className="space-y-1">
                      <li>
                        <span className="text-green-300 font-bold">Date: </span>
                        {new Date(booking.createdAt).toLocaleString()}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">ID: </span>
                        {booking._id}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">Room: </span>
                        {booking.roomNumber}
                      </li>
                    </ul>
                  </td>

                  <td className="px-4 py-3 border text-xs text-white">
                    <ul className="space-y-1">
                      <li>
                        <span className="text-green-300 font-bold">Name: </span>
                        {booking.customerName}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Phone:{" "}
                        </span>
                        {booking.customerPhone}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Adhar:{" "}
                        </span>
                        {booking.customerAdharId}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Address:{" "}
                        </span>
                        {booking.customerAddress}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          People:{" "}
                        </span>
                        {booking.NumberOfPeople}
                      </li>
                    </ul>
                  </td>

                  <td className="px-4 py-3 border text-xs text-white">
                    <ul className="space-y-1">
                      <li>
                        <span className="text-green-300 font-bold">
                          Check-In:{" "}
                        </span>
                        {new Date(booking.checkInDateTime).toLocaleString()}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Check-Out:{" "}
                        </span>
                        {new Date(booking.checkOutDateTime).toLocaleString()}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Booking Status:{" "}
                        </span>
                        {booking.bookingStatus}
                      </li>
                    </ul>
                  </td>

                  <td className="px-4 py-3 border text-white text-xs">
                    <ul className="space-y-1">
                      <li>
                        <span className="text-green-300 font-bold">
                          Total_Amt:{" "}
                        </span>
                        {booking.totalCost}
                      </li>

                      <li>
                        <span className="text-green-300 font-bold">
                          Sell_Amt:{" "}
                        </span>
                        {booking.sellingPrice}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Adv_Amnt:{" "}
                        </span>
                        {booking.advanceAmount}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Bal_Amt:{" "}
                        </span>
                        {booking.balanceAmount}
                      </li>
                      <li>
                        <span className="text-green-300 font-bold">
                          Pay_Status:{" "}
                        </span>
                        {booking.paymentStatus}
                      </li>
                    </ul>
                  </td>

                  <td className="px-4 py-3 border text-white">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={booking.bookingStatus !== "confirmed"}
                      className={`text-xs bg-blue-500 mt-4 px-4 py-2 rounded ${
                        booking.bookingStatus === "confirmed"
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      Cancel
                    </button>
                    <br />
                    <button
                      disabled={booking.bookingStatus !== "confirmed"}
                      onClick={() => {
                        const newCheckoutDateTime = prompt(
                          "Enter new checkout date and time (YYYY-MM-DD HH:MM):"
                        );

                        if (newCheckoutDateTime) {
                          handleEarlyCheckout(booking._id, newCheckoutDateTime);
                        }
                      }}
                      className={`text-xs bg-blue-500  px-4 py-2 rounded mt-4 ${
                        booking.bookingStatus === "confirmed"
                          ? "bg-blue-500 text-white px-4 py-2 rounded mt-4"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      Early CheckOut
                    </button>

                    <br />
                    <button
                      onClick={() => handlefinalCheckout(booking._id)}
                      disabled={booking.bookingStatus !== "confirmed"}
                      className={`text-xs bg-blue-500 mt-4 px-4 py-2 rounded ${
                        booking.bookingStatus === "confirmed"
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      Final CheckOut
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;
