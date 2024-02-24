import http from "../utilities/http-axios";

const getSyllabus = (filter) => {
  return http.post("/syllabus/get", filter);
};

const createSyllabus = (data) => {
  return http.post("/syllabus/create", data);
};

const updateSyllabus = (data) => {
  return http.post(`/syllabus/update`, data);
};

const deletesyllabus = (id) => {
  return http.delete(`/syllabus/${id}`);
};

const syllabusService = {
  getSyllabus,
  createSyllabus,
  updateSyllabus,
  deletesyllabus,
};

export default syllabusService;
