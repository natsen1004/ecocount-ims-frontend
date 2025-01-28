import axios from "axios";

const api = axios.create({
  baseURL: "https://ecocount-ims-backend.onrender.com", 
  timeout: 5000, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
