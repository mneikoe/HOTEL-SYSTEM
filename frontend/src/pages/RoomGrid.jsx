import PropTypes from "prop-types";

// Define the RoomGrid component
const RoomGrid = ({ rooms, handleRoomDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full ">
      {rooms.map((room) => (
        <div
          key={room._id}
          id={room._id}
          className="group rounded-2xl overflow-hidden shadow-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300"
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src={room.imageUrl}
              alt={room.roomNumber}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="p-6">
            <h4 className="text-xl font-semibold text-white mb-2">
              {room.type}
            </h4>
            <p className="text-white">Room: {room.roomNumber}</p>
            <p className="text-white">Floor: {room.floorNumber}</p>
            <p className="text-white">Price: ₹{room.price}/night</p>
            <p className="text-white">
              Created By: {room.createdBy.id} ({room.createdBy.role})
            </p>
            <div className="flex mt-4">
              <button
                onClick={() => handleRoomDelete(room._id)}
                className="bg-red-600 text-white py-1 px-3 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 mr-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Define prop types for the RoomGrid component
RoomGrid.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      roomNumber: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      floorNumber: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      createdBy: PropTypes.shape({
        id: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  handleRoomDelete: PropTypes.func.isRequired,
};

export default RoomGrid;
