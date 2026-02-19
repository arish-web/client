import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Availability() {
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchSlots = async () => {
    try {
      const res = await API.get("/availability?page=1&limit=10");
      setSlots(res.data.data);
    } catch {
      alert("Failed to load availability");
    }
  };

  const createSlot = async () => {
    if (!startTime || !endTime) {
      return alert("Select start and end time");
    }

    try {
      await API.post("/availability", {
        startTime,
        endTime
      });

      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create slot");
    }
  };

  const deleteSlot = async (id) => {
    try {
      await API.delete(`/availability/${id}`);
      fetchSlots();
    } catch {
      alert("Failed to delete slot");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Set Availability</h2>

      {/* Create slot */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
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
          onClick={createSlot}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Slot
        </button>
      </div>

      {/* Existing slots */}
      <h3 className="text-lg font-semibold mb-3">My Availability</h3>

      {slots.length === 0 && <p>No slots created</p>}

      {slots.map((s) => (
        <div
          key={s.id}
          className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-3"
        >
          <p>
            <b>From:</b>{" "}
            {new Date(s.startTime).toLocaleString()}
          </p>
          <p>
            <b>To:</b>{" "}
            {new Date(s.endTime).toLocaleString()}
          </p>

          <button
            onClick={() => deleteSlot(s.id)}
            className="bg-red-600 text-white px-3 py-1 rounded mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
