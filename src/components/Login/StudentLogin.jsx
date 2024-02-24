import HeaderContext from "@/context/HeaderContext";
import studentService from "@/services/studentService";
import { formatTodayDate } from "@/utilities/usefulFunctions";
import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsTable } from "react-icons/bs";
import { GiHand } from "react-icons/gi";
import { toast } from "react-toastify";

const StudentLogin = () => {
  const { setLoadingModal, setUserData } = useContext(HeaderContext);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const handleUserInput = (type, event) => {
    const value = event.target.value;
    if (type === "email") {
      setUserCredentials({ ...userCredentials, email: value });
    } else {
      setUserCredentials({ ...userCredentials, password: value });
    }
  };
  const handleOnLogin = () => {
    setLoadingModal(true);
    studentService
      .studentLogin(userCredentials)
      .then((res) => {
        console.log("Login response", res);
        if (res.data) {
          setLoadingModal(false);
          setUserData(res.data);
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
  };

  return (
    <div className="dashboard">
      <h4 className="dashboardDate">{formatTodayDate()}</h4>
      <h1 className="dashboardUserName">
        Hello, Student
        <GiHand className="dashboardHand" />
      </h1>
      <div className="partitionLine"></div>
      <h3 className="dashboardHeading" style={{ fontSize: "1.4rem" }}>
        Login To Check Your Attendance <BsTable />{" "}
      </h3>
      <div className="partitionLine"></div>
      <div className="studentLogin">
        <Form>
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
          <Button variant="primary" onClick={handleOnLogin}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default StudentLogin;
