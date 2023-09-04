import http from "../utilities/http-axios";

const getAllCourses = (filter) => {
  return http.post("/course/all", filter);
};

const getCourse = (id) => {
  return http.get(`/course/${id}`);
};

const createCourse = (data) => {
  return http.post("/course/", data);
};

const updateCourse = (data) => {
  return http.put(`/course/`, data);
};

const deleteCourse = (id) => {
  return http.delete(`/course/${id}`);
};

const courseService = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseService;
