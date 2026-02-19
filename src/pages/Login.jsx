import { useState } from "react";
import API from "../api/axios";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login({ setToken, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleLogin = async () => {
    const res = await API.post("/auth/login", { email, password });
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("role", res.data.role);
    sessionStorage.setItem("userId", res.data.userId);
    sessionStorage.setItem("tenantId", res.data.tenantId);

    setToken(res.data.token);
    setRole(res.data.role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Airman LMS</h2>

        {/* EMAIL */}
        <input
          className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            className="w-full p-2 pr-10 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
