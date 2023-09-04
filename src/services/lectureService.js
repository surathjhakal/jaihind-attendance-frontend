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

const updateLecture = (data) => {
  return http.put(`/lecture/`, data);
};

const deleteLecture = (id) => {
  return http.delete(`/lecture/${id}`);
};

const lectureService = {
  getAllLectures,
  getLecture,
  createLecture,
  updateLecture,
  deleteLecture,
};

export default lectureService;
