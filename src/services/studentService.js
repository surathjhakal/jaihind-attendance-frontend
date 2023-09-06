import http from "../utilities/http-axios";

const getAllStudent = (filter) => {
  return http.post("/student/all", filter);
};

const getStudent = (id) => {
  return http.get(`/student/${id}`);
};

const getStudentByUID = (uid) => {
  return http.get(`/student/uid/${uid}`);
};

const createStudent = (data) => {
  return http.post("/student/", data);
};

const updateStudent = (data) => {
  return http.put(`/student/`, data);
};

const deleteStudent = (id) => {
  return http.delete(`/student/${id}`);
};

const sendEmail = (students) => {
  return http.post("/student/send-email", students);
};

const getAttendance = (data) => {
  return http.post("/student/get-attendance", data);
};

const studentService = {
  getAllStudent,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  sendEmail,
  getAttendance,
  getStudentByUID,
};

export default studentService;
