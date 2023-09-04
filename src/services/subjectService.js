import http from "../utilities/http-axios";

const getAllSubjects = (filter) => {
  return http.post("/subject/all", filter);
};

const getSubject = (id) => {
  return http.get(`/subject/${id}`);
};

const createSubject = (data) => {
  return http.post("/subject/", data);
};

const updateSubject = (data) => {
  return http.put(`/subject/`, data);
};

const deleteSubject = (id) => {
  return http.delete(`/subject/${id}`);
};

const subjectService = {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};

export default subjectService;
