const app = require("./app");
const http = require("http");

const Manager = require("./models/Manager");
const Receptionist = require("./models/Receptionist");
const Room = require("./models/Room");
const Booking = require("./models/Booking");
const bookingController = require("./controllers/bookingController");

const PORT = process.env.PORT || 7001;

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://indiga.atithikripa.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected from server");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  const sendManagers = async () => {
    console.log("Sending managers");
    try {
      const managers = await Manager.find();
      io.emit("managers", managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const sendReceptionists = async () => {
    console.log("Sending receptionists");
    try {
      const receptionists = await Receptionist.find();
      io.emit("receptionists", receptionists);
    } catch (error) {
      console.error("Error fetching receptionists:", error);
    }
  };

  const sendRooms = async () => {
    console.log("Sending rooms");
    try {
      const rooms = await Room.find();
      io.emit("rooms", rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const sendBookings = async () => {
    console.log("Sending bookings");
    try {
      const bookings = await Booking.find().populate("roomId");
      const bookingsWithRoomNumbers = bookings.map((booking) => {
        return { ...booking.toObject(), roomNumber: booking.roomNumber };
      });
      io.emit("bookings", bookingsWithRoomNumbers);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  sendManagers();
  sendReceptionists();
  sendRooms();
  sendBookings();

  // Manager CRUD operations
  socket.on("createManager", async (data) => {
    try {
      const newManager = new Manager(data);
      await newManager.save();
      sendManagers();
    } catch (error) {
      console.error("Error creating manager:", error);
    }
  });

  socket.on("updateManager", async (data) => {
    try {
      await Manager.findByIdAndUpdate(data.id, data);
      sendManagers();
    } catch (error) {
      console.error("Error updating manager:", error);
    }
  });

  socket.on("deleteManager", async (id) => {
    try {
      await Manager.findByIdAndDelete(id);
      sendManagers();
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  });

  // Receptionist CRUD operations
  socket.on("createReceptionist", async (data) => {
    try {
      const newReceptionist = new Receptionist(data);
      await newReceptionist.save();
      sendReceptionists();
    } catch (error) {
      console.error("Error creating receptionist:", error);
    }
  });

  socket.on("updateReceptionist", async (data) => {
    try {
      await Receptionist.findByIdAndUpdate(data.id, data);
      sendReceptionists();
    } catch (error) {
      console.error("Error updating receptionist:", error);
    }
  });

  socket.on("deleteReceptionist", async (id) => {
    try {
      await Receptionist.findByIdAndDelete(id);
      sendReceptionists();
    } catch (error) {
      console.error("Error deleting receptionist:", error);
    }
  });

  // Room CRUD operations
  socket.on("createRoom", async (data) => {
    try {
      const shortType = data.type.substring(0, 3);
      const generatedRoomNumber = `${shortType}-${data.roomNumber}-${data.floorNumber}`;
      data.roomNumber = generatedRoomNumber;
      const newRoom = new Room(data);
      await newRoom.save();
      sendRooms();
    } catch (error) {
      console.error("Error creating room:", error);
    }
  });

  socket.on("updateRoom", async (data) => {
    try {
      await Room.findByIdAndUpdate(data.id, data);
      sendRooms();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  });

  socket.on("deleteRoom", async (id) => {
    try {
      await Room.findByIdAndDelete(id);
      sendRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  });

  // Handle booking events for real-time updates
  socket.on("newBooking", async (data) => {
    try {
      await bookingController.createBooking(data, io);
      const rooms = await Room.find();
      socket.emit("rooms", rooms);
      const bookings = await Booking.find();
      const bookingsWithRoomDetails = await Promise.all(
        bookings.map(async (booking) => {
          const room = await Room.findOne({ roomNumber: booking.roomNumber });
          return { ...booking.toObject(), roomDetails: room };
        })
      );
      io.emit("bookings", bookingsWithRoomDetails);
    } catch (error) {
      console.error("Error handling new booking:", error);
    }
  });
});
app.listen(PORT, "0.0.0.0", () => {
  // Bind to all network interfaces
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
