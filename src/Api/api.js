import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-mern-backend-a83s.onrender.com",
  // baseURL:"http://localhost:5000"
});
export default api;
