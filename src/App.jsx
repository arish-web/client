import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import InstructorBookings from "./pages/InstructorBookings";
import AdminPanel from "./pages/AdminPanel";
import Availability from "./pages/Availability";
import Quiz from "./pages/Quiz";
import AuditLogs from "./pages/AuditLogs";

import { FiSun, FiMoon } from "react-icons/fi";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [role, setRole] = useState(sessionStorage.getItem("role"));
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [page, setPage] = useState("courses");

  const [theme, setTheme] = useState(
    sessionStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    sessionStorage.clear();
    setToken(null);
    setRole(null);
    setPage("courses");
  };

  if (!token) {
    return <Login setToken={setToken} setRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 shadow">
        <div className="flex gap-6 font-semibold">
          <button onClick={() => setPage("courses")}>Courses</button>

          {role === "STUDENT" && (
            <>
              <button onClick={() => setPage("booking")}>Booking</button>
              <button onClick={() => setPage("myBookings")}>My Bookings</button>
            </>
          )}

          {role === "INSTRUCTOR" && (
            <button onClick={() => setPage("instructorBookings")}>
              Requests
            </button>
          )}

          {role === "INSTRUCTOR" && (
            <button onClick={() => setPage("availability")}>
              Availability
            </button>
          )}

          {role === "ADMIN" && (
            <>
              <button onClick={() => setPage("admin")}>Admin</button>
              <button onClick={() => setPage("audit")}>Audit Logs</button>
            </>
          )}
        </div>

        <div className="flex items-center gap-6">
          <span className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700">
            {role}
          </span>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button onClick={logout} className="text-red-500 font-semibold">
            Logout
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-6">
        {page === "courses" && (
          <Courses
            role={role}
            setPage={setPage}
            setSelectedQuizId={setSelectedQuizId}
          />
        )}

        {page === "quiz" && selectedQuizId && (
          <Quiz quizId={selectedQuizId} setPage={setPage} />
        )}

        {page === "booking" && role === "STUDENT" && <Booking />}

        {page === "myBookings" && role === "STUDENT" && <MyBookings />}

        {page === "instructorBookings" && role === "INSTRUCTOR" && (
          <InstructorBookings />
        )}

        {page === "availability" && role === "INSTRUCTOR" && <Availability />}

        {page === "admin" && role === "ADMIN" && <AdminPanel />}

        {page === "audit" && role === "ADMIN" && <AuditLogs />}
      </div>
    </div>
  );
}
