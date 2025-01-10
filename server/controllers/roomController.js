const Room = require("../models/Room");

// Create Room
exports.createRoom = async (req, res) => {
  const { type, roomNumber, floorNumber, price, imageUrl, createdBy } =
    req.body;
  try {
    const shortType = type.substring(0, 3);
    const generatedRoomNumber = `${shortType}-${roomNumber}-${floorNumber}`;
    const newRoom = new Room({
      type,
      roomNumber: generatedRoomNumber,
      floorNumber,
      price,
      imageUrl,
      createdBy,
    });
    await newRoom.save();

    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Error creating room" });
  }
};
// Get All Rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Error fetching rooms" });
  }
};

// Get Room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ error: "Error fetching room" });
  }
};

// Update Room
exports.updateRoom = async (req, res) => {
  const { type, roomNumber, floorNumber, price, imageUrl, createdBy } =
    req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { type, roomNumber, floorNumber, price, imageUrl, createdBy },
      { new: true }
    );

    if (!updatedRoom) return res.status(404).json({ error: "Room not found" });

    req.app.get("socketio").emit("rooms", await Room.find());

    res.json({
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate room number, please use a unique room number",
      });
    }
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Error updating room" });
  }
};

// Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ message: "Room deleted successfully", deletedAt: new Date() });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Error deleting room" });
  }
};
// book room
