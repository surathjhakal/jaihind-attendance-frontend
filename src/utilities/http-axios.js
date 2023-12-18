import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

api.defaults.headers.common["App-Origin"] = "Web";

export default api;
