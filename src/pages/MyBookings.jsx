import { useEffect, useState } from "react";
import API from "../api/axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const res = await API.get("/booking?page=1&limit=20");
      setBookings(res.data.data || res.data); // supports both paginated & normal
    } catch (err) {
      alert("Error loading bookings");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusColor = (status) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "REJECTED") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Instructor: {b.instructorId}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(b.startTime).toLocaleString()} →
                    {new Date(b.endTime).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded ${getStatusColor(
                    b.status,
                  )}`}
                >
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
