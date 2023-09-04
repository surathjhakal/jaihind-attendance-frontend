import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const ForgotPassword = (props: Props) => {
  return (
    <div>
      <h1>ForgotPassword</h1>
      <Link to="/login">Remember Passowrd</Link>
    </div>
  );
};

export default ForgotPassword;
