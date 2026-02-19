import { useEffect, useState } from "react";
import API from "../api/axios";

export default function InstructorBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/booking/instructor");
      setBookings(res.data);
    } catch (err) {
      alert("Error loading instructor bookings");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/booking/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Sessions</h2>

      {bookings.length === 0 && <p>No assigned sessions</p>}

      {bookings.map((b) => (
        <div
          key={b.id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-3"
        >
          <p>
            <b>Student:</b> {b.studentId}
          </p>
          <p>
            <b>From:</b> {new Date(b.startTime).toLocaleString()}
          </p>
          <p>
            <b>To:</b> {new Date(b.endTime).toLocaleString()}
          </p>
          <p>
            <b>Status:</b> {b.status}
          </p>

          {/* Instructor actions only after assignment */}
          {b.status === "ASSIGNED" && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => updateStatus(b.id, "COMPLETED")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark Completed
              </button>

              <button
                onClick={() => updateStatus(b.id, "CANCELLED")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel Session
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
