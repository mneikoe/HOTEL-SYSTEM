import { useState } from "react";
import axios from "axios";

const BookingComponent = ({ booking }) => {
  const [showForm, setShowForm] = useState(false);
  const [newCheckoutDateTime, setNewCheckoutDateTime] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [notification, setNotification] = useState(null);

  const handleEarlyCheckout = async (
    bookingId,
    newCheckoutDateTime,
    amountReceived
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:7001/api/early-checkout",
        {
          bookingId,
          newCheckoutDateTime,
          amountReceived,
        }
      );

      showNotification("success", response.data.message);
      setShowForm(false); // Close the form on success
    } catch (error) {
      console.error("Early checkout failed:", error);
      showNotification("error", "Early checkout failed. Please try again.");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
  };

  return (
    <div>
      {/* Early Checkout Button */}
      <button
        disabled={booking.bookingStatus !== "confirmed"}
        onClick={() => setShowForm(true)}
        className={`text-xs px-4 py-2 rounded mt-4 ${
          booking.bookingStatus === "confirmed"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        Early CheckOut
      </button>

      {/* Inline Form to Input New Checkout Date and Amount Received */}
      {showForm && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">Early Checkout</h2>

            {/* Notification Display */}
            {notification && (
              <div
                className={`mb-4 p-2 rounded ${
                  notification.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {notification.message}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEarlyCheckout(
                  booking.id,
                  newCheckoutDateTime,
                  amountReceived
                );
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="newCheckoutDateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Checkout Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="newCheckoutDateTime"
                  name="newCheckoutDateTime"
                  value={newCheckoutDateTime}
                  onChange={(e) => setNewCheckoutDateTime(e.target.value)}
                  required
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="amountReceived"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount Received
                </label>
                <input
                  type="number"
                  id="amountReceived"
                  name="amountReceived"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(e.target.value)}
                  required
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingComponent;
