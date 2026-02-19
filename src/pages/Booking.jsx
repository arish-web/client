import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Booking() {
  const [instructors, setInstructors] = useState([]);
  const [instructorId, setInstructorId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    API.get("/auth/instructors").then((res) => {
      setInstructors(res.data);
    });
  }, []);

  const createBooking = async () => {
    try {
      await API.post("/booking", {
        instructorId,
        startTime,
        endTime,
      });

      alert("Booking requested!");
      setInstructorId("");
      setStartTime("");
      setEndTime("");
    } catch {
      alert("Failed to create booking");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Book Instructor</h2>

      <select
        value={instructorId}
        onChange={(e) => setInstructorId(e.target.value)}
        className="border p-2 w-full mb-3"
      >
        <option value="">Select Instructor</option>
        {instructors.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} ({i.email})
          </option>
        ))}
      </select>

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <button
        onClick={createBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Booking
      </button>
    </div>
  );
}
