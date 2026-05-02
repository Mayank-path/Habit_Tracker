import axios from "axios";

const BASE_URL = "https://habit-tracker-xnfg.onrender.com"; 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});


axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
