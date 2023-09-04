import http from "../utilities/http-axios";

const getAllTeacher = (filter) => {
  return http.post("/teacher/all", filter);
};

const getTeacher = (id) => {
  return http.get(`/teacher/${id}`);
};

const teacherLogin = (data) => {
  return http.post("/teacher/login", data);
};

const teacherLogout = (id) => {
  return http.post(`/teacher/logout/${id}`);
};

const createTeacher = (data) => {
  return http.post("/teacher/", data);
};

const updateTeacher = (data) => {
  return http.put("/teacher/", data);
};

const deleteTeacher = (id) => {
  return http.delete(`/teacher/${id}`);
};

const teacherService = {
  getAllTeacher,
  getTeacher,
  teacherLogin,
  teacherLogout,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};

export default teacherService;
