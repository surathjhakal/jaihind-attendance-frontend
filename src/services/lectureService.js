import http from "../utilities/http-axios";

const getAllLectures = (filter) => {
  return http.post("/lecture/all", filter);
};

const getLecture = (id) => {
  return http.get(`/lecture/${id}`);
};

const createLecture = (data) => {
  return http.post("/lecture/", data);
};

const createLectureQRCode = (data) => {
  return http.post("/lecture/create-qr", data);
};

const updateLecture = (data) => {
  return http.put(`/lecture/`, data);
};

const deleteLecture = (id) => {
  return http.delete(`/lecture/${id}`);
};

const getLectureQRList = (lectureID) => {
  return http.post(`/lecture/qrCode/${lectureID}`);
};

const lectureService = {
  getAllLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
  createLectureQRCode,
  getLectureQRList,
};

export default lectureService;
