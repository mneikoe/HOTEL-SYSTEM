const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");
const Manager = require("./models/Manager"); // Ensure this line is added
const port = process.env.PORT || 7001;

// Create a http server
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  const sendManagers = async () => {
    try {
      const managers = await Manager.find(); // Fetch all managers
      io.emit("managers", managers); // Broadcast updated managers list to all clients
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  sendManagers(); // Send initial data when a client connects

  socket.on("createManager", async (data) => {
    try {
      const newManager = new Manager(data);
      await newManager.save();
      sendManagers(); // Broadcast update
    } catch (error) {
      console.error("Error creating manager:", error);
    }
  });

  socket.on("updateManager", async (data) => {
    try {
      await Manager.findByIdAndUpdate(data.id, data);
      sendManagers(); // Broadcast update
    } catch (error) {
      console.error("Error updating manager:", error);
    }
  });

  socket.on("deleteManager", async (id) => {
    try {
      await Manager.findByIdAndDelete(id);
      sendManagers(); // Broadcast update
    } catch (error) {
      console.error("Error deleting manager:", error);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
