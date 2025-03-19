import axios from "axios";

// Configuración de la API, aquí debes poner la URL de tu servidor Express
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api", // Asegúrate de que la URL sea la correcta
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
