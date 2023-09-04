import http from "../utilities/http-axios";

const loginByToken = () => {
  return http.get("/token/login-by-token");
};

const tokenService = {
  loginByToken,
};

export default tokenService;
