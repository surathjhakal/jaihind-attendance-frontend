import adminService from "@/services/adminService";
import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {};

const validateEmail = (email: any) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const ForgotPassword = (props: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleOnSendMail = () => {
    if (email === "" || !validateEmail) {
      toast.error("Please enter valid email", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    setLoading(true);
    adminService
      .resetPassword({ email: email })
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success("Reset password email sent!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        toast.error("Something went wrong!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };
  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100vh",
      }}
    >
      <h3 className="dashboardHeading">Forgot Password</h3>
      <div className="partitionLine" style={{ margin: 0 }}></div>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => {
            e.preventDefault();
            setEmail(e.target.value);
          }}
          value={email}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleOnSendMail}>
        Send Mail{" "}
        {loading && (
          <Spinner
            animation="border"
            variant="light"
            style={{ height: "20px", width: "20px" }}
          />
        )}
      </Button>
      <Link to="/login">Go back</Link>
    </div>
  );
};

export default ForgotPassword;
