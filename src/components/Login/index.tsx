import React, { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import "@/css/Login.css";
import { Link } from "react-router-dom";
import adminService from "@/services/adminService";
import HeaderContext from "@/context/HeaderContext";
import { toast } from "react-toastify";
import teacherService from "@/services/teacherService";
import fileService from "@/services/fileService";

type Props = {};

const Login = (props: Props) => {
  const { setUserData, setLoadingModal, setProfilePhoto }: any =
    useContext(HeaderContext);
  const [loginOption, setLoginOption] = useState<string>("Admin");
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSelectedLoginOption = (option: string) => {
    setLoginOption(option);
  };

  const handleUserInput = (type: string, event: any) => {
    const value = event.target.value;
    if (type === "email") {
      setUserCredentials({ ...userCredentials, email: value });
    } else {
      setUserCredentials({ ...userCredentials, password: value });
    }
  };

  const handleOnLogin = () => {
    if (loginOption === "Admin") {
      setLoadingModal(true);
      adminService
        .adminLogin(userCredentials)
        .then((res) => {
          console.log("Login response", res);
          if (res.data) {
            setLoadingModal(false);
            setUserData(res.data);
            if (res.data.profilePhoto && res.data.profilePhoto !== "") {
              fileService
                .getProfilePhoto(res.data.profilePhoto)
                .then((res) => {
                  console.log(res);
                  setProfilePhoto(res.data);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error("Error fetching profile photo", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  });
                });
            } else {
              setProfilePhoto(null);
            }
          }
        })
        .catch((error) => {
          setLoadingModal(false);
          console.log("ERROR LOGIN", error);
          const errorMessage = error.response?.data?.message;
          if (errorMessage === "INVALID_EMAIL") {
            toast.error("Invalid Email !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else if (errorMessage === "INVALID_PASSWORD") {
            toast.error("Invalid Password !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else if (errorMessage === "EMAIL_NOT_FOUND") {
            toast.error("Email Not Found !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else {
            toast.error("Something Happened !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        });
    } else {
      setLoadingModal(true);
      teacherService
        .teacherLogin(userCredentials)
        .then((res) => {
          console.log("Login response", res);
          if (res.data) {
            setLoadingModal(false);
            setUserData(res.data);
            if (res.data.profilePhoto && res.data.profilePhoto !== "") {
              fileService
                .getProfilePhoto(res.data.profilePhoto)
                .then((res) => {
                  console.log(res);
                  setProfilePhoto(res.data);
                })
                .catch((err) => {
                  console.log(err);
                  toast.error("Error fetching profile photo", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  });
                });
            } else {
              setProfilePhoto(null);
            }
          }
        })
        .catch((error) => {
          setLoadingModal(false);
          console.log("ERROR LOGIN", error);
          const errorMessage = error.response?.data?.message;
          if (errorMessage === "INVALID_EMAIL") {
            toast.error("Invalid Email !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else if (errorMessage === "INVALID_PASSWORD") {
            toast.error("Invalid Password !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else if (errorMessage === "EMAIL_NOT_FOUND") {
            toast.error("Email Not Found !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else {
            toast.error("Something Happened !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        });
    }
  };

  return (
    <div className="login">
      <div className="loginBox">
        <div className="loginOptions">
          <div
            className={`loginOption ${
              loginOption === "Admin" && "loginOptionActive"
            }`}
            onClick={() => handleSelectedLoginOption("Admin")}
          >
            Admin
          </div>
          <div
            className={`loginOption ${
              loginOption === "Staff" && "loginOptionActive"
            }`}
            onClick={() => handleSelectedLoginOption("Staff")}
          >
            Staff
          </div>
        </div>
        <Form className="loginForm">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => handleUserInput("email", e)}
              value={userCredentials.email}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => handleUserInput("password", e)}
              value={userCredentials.password}
            />
          </Form.Group>
          <Button
            variant="success"
            className="loginButton"
            onClick={handleOnLogin}
          >
            LOGIN
          </Button>
        </Form>
        <Link to="/login/forgotPassword" className="loginForgotPasswordButton">
          Reset password?
        </Link>
      </div>
    </div>
  );
};

export default Login;
