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

const markQrAttendance = (data) => {
  return http.post("/student/mark-qr-attendance", data);
};

const markFingerprintAttendance = (data) => {
  return http.post("/student/mark-fingerprint-attendance", data);
};

const studentLogin = (data) => {
  return http.post("/student/login", data);
};

const studentLogout = (id) => {
  return http.post(`/student/logout/${id}`);
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
  studentLogin,
  studentLogout,
  markQrAttendance,
  markFingerprintAttendance,
};

export default studentService;
