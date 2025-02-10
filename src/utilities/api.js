import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5173";

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export { API_URL };
export default api;

