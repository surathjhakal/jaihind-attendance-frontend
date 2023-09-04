import http from "../utilities/http-axios";

const getAllActionLogs = (filter) => {
  return http.post("/action-log/all", filter);
};

const getActionLogData = (id) => {
  return http.get(`/action-log/${id}`);
};

const createActionLog = (data) => {
  return http.post("/action-log/", data);
};

const deleteActionLog = (id) => {
  return http.delete(`/action-log/${id}`);
};

const actionLogService = {
  getAllActionLogs,
  getActionLogData,
  createActionLog,
  deleteActionLog,
};

export default actionLogService;
