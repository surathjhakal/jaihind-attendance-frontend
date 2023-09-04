import http from "../utilities/http-axios";

const getAllDepartments = (filter) => {
  return http.post("/department/all", filter);
};

const getDepartment = (id) => {
  return http.get(`/department/${id}`);
};

const createDepartment = (data) => {
  return http.post("/department/", data);
};

const updateDepartment = (data) => {
  return http.put(`/department/`, data);
};

const deleteDepartment = (id) => {
  return http.delete(`/department/${id}`);
};

const departmentService = {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};

export default departmentService;
