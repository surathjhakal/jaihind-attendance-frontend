import axios from "axios";

const api = axios.create({
  baseURL: "https://us-central1-jaihind-attendance.cloudfunctions.net/api/api",
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

api.defaults.headers.common["App-Origin"] = "Web";

export default api;
