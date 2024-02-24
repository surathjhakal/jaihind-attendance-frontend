import axios from "axios";

const http = axios.create({
  baseURL: "https://us-central1-jaihind-attendance.cloudfunctions.net/api/api",
  headers: {
    "Content-type": "multipart/form-data",
  },
  withCredentials: true,
});

const uploadProfilePhoto = (file) => {
  return http.post("/file/upload-profile-photo", file);
};

const deleteProfilePhoto = (fileName) => {
  return http.delete(`/file/delete-profile-photo/${fileName}`);
};

const getProfilePhoto = (fileName) => {
  return http.get(`/file/get-profile-photo/${fileName}`);
};

const fileService = {
  uploadProfilePhoto,
  deleteProfilePhoto,
  getProfilePhoto,
};

export default fileService;
