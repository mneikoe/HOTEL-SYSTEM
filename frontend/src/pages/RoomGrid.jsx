// RoomGrid.js
import PropTypes from "prop-types";

// Define the RoomGrid component
const RoomGrid = ({ rooms, handleRoomDelete, toggleDropdown }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {rooms.map((room) => (
        <div
          key={room._id}
          id={room._id}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <img
            src={room.imageUrl}
            alt={room.roomNumber}
            className="w-full object-cover h-48"
          />
          <button
            onClick={() => toggleDropdown(room._id)}
            className="bg-green-600 text-white py-2 px-4 w-full hover:bg-green-800"
          >
            {room.roomNumber} Details
          </button>
          <div className="room-details p-4 flex flex-col items-start">
            <h4 className="text-lg font-bold">{room.type}</h4>
            <p>Room: {room.roomNumber}</p>
            <p>Floor: {room.floorNumber}</p>
            <p>Price: ₹{room.price}/night</p>
            <p>
              Created By: {room.createdBy.id} ({room.createdBy.role})
            </p>
            <div className="flex w-full">
              <button
                onClick={() => handleRoomDelete(room._id)}
                className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-800 mr-2"
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
  toggleDropdown: PropTypes.func.isRequired,
};

export default RoomGrid;
