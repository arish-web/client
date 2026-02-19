import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [instructors, setInstructors] = useState({});
  const [selected, setSelected] = useState({});
  console.log("bookings", bookings);

  const loadData = async () => {
    const res = await API.get("/booking/pending");
    console.log("FULL RESPONSE:", res.data.data);
    console.log("DATA:", res.data);
    setBookings(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);
  console.log("loadData", loadData);

  const approve = async (id) => {
    await API.patch(`/booking/${id}/approve`);
    loadData();
  };

  useEffect(() => {
    const loadInstructors = async () => {
      const res = await API.get("/auth/instructors"); // or your correct route
      setInstructors(res.data);
    };

    loadInstructors();
  }, []);

  const assign = async (id) => {
    await API.patch(`/booking/${id}/assign`, {
      instructorId: selected[id],
    });
    loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {bookings.map((b) => (
        <div key={b.id} className="bg-white p-4 rounded shadow mb-4">
          <p>
            <b>Booking:</b> {b.id}
          </p>
          <p>
            <b>Status:</b> {b.status}
          </p>

          <button
            onClick={() => approve(b.id)}
            className="bg-green-600 text-white px-3 py-1 mr-3 rounded"
          >
            Approve
          </button>

          <select
            value={selected[b.id] || ""}
            required
            onChange={(e) =>
              setSelected({
                ...selected,
                [b.id]: e.target.value,
              })
            }
            className="border px-2 py-1 mr-2"
          >
            <option value="">Select Instructor</option>

            {instructors.length > 0 &&
              instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.email})
                </option>
              ))}
          </select>

          <button
            onClick={() => assign(b.id)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Assign
          </button>
        </div>
      ))}
    </div>
  );
}
