import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Attach access token
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (AUTO REFRESH)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          sessionStorage.getItem("refreshToken");

        const res = await axios.post(
          "http://localhost:5000/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        sessionStorage.setItem(
          "accessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (err) {
        sessionStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default API;