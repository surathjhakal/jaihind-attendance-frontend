import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "@/components/Login";
import Header from "@/components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import HeaderContext from "@/context/HeaderContext";
import { Suspense, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import ForgotPassword from "@/components/Login/ForgotPassword";
import Dashboard from "@/components/Dashboard";
import Profile from "@/components/Profile";
import tokenService from "@/services/tokenService";
import Admin from "./components/Admin";
import CreateAction from "@/components/Actions/CreateAction";
import UpdateAction from "@/components/Actions/UpdateAction";
import Teacher from "./components/Teacher";
import Student from "./components/Student";
import { ToastContainer, toast } from "react-toastify";
import LoadingModal from "./components/LoadingModal";
import Course from "./components/Course";
import Lecture from "./components/Lecture";
import CreateLecture from "./components/Lecture/CreateLecture";
import Activity from "./components/Activity";
import Department from "./components/Department";
import Subject from "./components/Subject";
import UpdateLecture from "./components/Lecture/UpdateLecture";
import fileService from "./services/fileService";

function App() {
  const { userData, setUserData, setLoadingModal, setProfilePhoto }: any =
    useContext(HeaderContext);
  useEffect(() => {
    async function fetchData() {
      setLoadingModal(true);
      tokenService
        .loginByToken()
        .then((res) => {
          console.log(res);
          if (res.data) setUserData(res.data);
          setLoadingModal(false);
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
          }
        })
        .catch((error) => {
          console.log(error);
          setLoadingModal(false);
        });
    }
    if (!userData) {
      fetchData();
    }
  }, []);

  console.log(userData);
  return (
    <div className="App">
      <Header />
      <ToastContainer />
      <LoadingModal />
      <Routes>
        {!userData ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/login/forgotPassword" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/student" element={<Student />} />
            <Route path="/lecture" element={<Lecture />} />
            <Route path="/course" element={<Course />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/subject" element={<Subject />} />
            <Route path="/department" element={<Department />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
