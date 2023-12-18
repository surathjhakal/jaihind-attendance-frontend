import http from "../utilities/http-axios";

const getAllAdmin = (filter) => {
  return http.post("/admin/all", filter);
};

const getAdmin = (id) => {
  return http.get(`/admin/${id}`);
};

const adminLogin = (data) => {
  return http.post("/admin/login", data);
};

const adminLogout = (id) => {
  return http.post(`/admin/logout/${id}`);
};

const createAdmin = (data) => {
  return http.post("/admin/", data);
};

const updateAdmin = (data) => {
  return http.put(`/admin/`, data);
};

const deleteAdmin = (id) => {
  return http.delete(`/admin/${id}`);
};

const resetPassword = (data) => {
  return http.post("/admin/reset-password", data);
};

const sendMailReminder = (data) => {
  return http.post("/admin/send-mail-reminder", data);
};

const adminService = {
  getAllAdmin,
  getAdmin,
  adminLogin,
  adminLogout,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  resetPassword,
  sendMailReminder,
};

export default adminService;
