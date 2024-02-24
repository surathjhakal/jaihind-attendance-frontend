import React, { useContext, useEffect, useState } from "react";
import { GiHand } from "react-icons/gi";
import { BsTable } from "react-icons/bs";
import { Accordion, Button, Col, Form, Row, Table } from "react-bootstrap";
import HeaderContext from "@/context/HeaderContext";
import { toast } from "react-toastify";
import studentService from "@/services/studentService";
import {
  checkPresentStatus,
  getOverallAttendancePrecentage,
  getSubjectAttendancePresent,
} from "@/utilities/studentAttendance";
import {
  formatDate,
  formatTodayDate,
  sortLectureData,
} from "@/utilities/usefulFunctions";
import ScanCode from "../ScanCode";
import { IoReload } from "react-icons/io5";

const AttendanceDashboard = () => {
  const { setLoadingModal, userData, setLoadingMessage } =
    useContext(HeaderContext);
  const [attendanceData, setAttendanceData] = useState(null);
  const [studentData, setStudentData] = useState(userData);
  const [attendanceScanner, setAttendanceScanner] = useState(null);

  const getStudentAttendance = () => {
    setLoadingModal(true);

    let sem;
    const currentMonth = new Date().getMonth() + 1;
    if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].includes(currentMonth)) {
      if (userData.year === 1) sem = 1;
      else if (userData.year === 2) sem = 3;
      else sem = 5;
    } else {
      if (userData.year === 1) sem = 2;
      else if (userData.year === 2) sem = 4;
      else sem = 6;
    }
    sem = sem + "";
    studentService
      .getAttendance({
        courseID: userData.courseID,
        sem: sem,
        studentID: userData.id,
      })
      .then((res) => {
        setAttendanceData(res.data);
        console.log(res);
        setLoadingModal(false);
      })
      .catch((err) => {
        setLoadingModal(false);
        console.log(err);
        toast.error("Error Loading Attendance !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  useEffect(() => {
    getStudentAttendance();
  }, [userData]);

  const handleScanData = (data) => {
    setAttendanceScanner(false);
    setLoadingModal(true);
    try {
      studentService
        .markQrAttendance({
          data: data,
          studentID: userData.id,
          captureTime: new Date().toISOString(),
        })
        .then((res) => {
          console.log(res.data);
          setLoadingModal(false);
          setLoadingMessage("");
          if (res.data.message === "Attendance Marked") {
            toast.success(res.data.message, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else if (res.data.message === "Attendance Already Marked") {
            toast.warning(res.data.message, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          } else {
            toast.error(res.data.message, {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          }
        });
    } catch (err) {
      setLoadingModal(false);
      console.log(err);
    }
  };

  return (
    <div className="dashboard">
      <h4 className="dashboardDate">{formatTodayDate()}</h4>
      <h1 className="dashboardUserName">
        Hello, {studentData?.name ?? "Student"}{" "}
        <GiHand className="dashboardHand" />
      </h1>
      <div className="partitionLine"></div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 className="dashboardHeading" style={{ fontSize: "1.4rem" }}>
          Check Your Attendance <BsTable />{" "}
        </h3>
        <Button onClick={() => setAttendanceScanner(true)}>Scan</Button>
      </div>
      <div className="partitionLine"></div>
      <Button
        variant="secondary"
        onClick={getStudentAttendance}
        style={{ display: "flex", marginLeft: "auto" }}
      >
        <IoReload size={20} />
      </Button>
      {attendanceData && (
        <>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "0.7rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 className="studentDataInfo">Name:</h2>
              <h2 className="studentDataInfo">Email:</h2>
              <h2 className="studentDataInfo">Year:</h2>
              <h2 className="studentDataInfo">UID:</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <h2 className="studentDataInfo">{studentData.name}</h2>
              <h2 className="studentDataInfo">{studentData.email}</h2>
              <h2 className="studentDataInfo">{studentData.year}</h2>
              <h2 className="studentDataInfo">{studentData.uid}</h2>
            </div>
          </div>
          {getOverallAttendancePrecentage(attendanceData, studentData.id)}
          <Accordion style={{ width: "100%" }}>
            {attendanceData.map((item, index) => (
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{item.subject.name}</Accordion.Header>
                <Accordion.Body style={{ padding: "1rem" }}>
                  {item.lectures.length === 0 ? (
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "1.1rem",
                        fontWeight: 400,
                        textAlign: "center",
                      }}
                    >
                      No Lectures Recorded
                    </h1>
                  ) : (
                    <>
                      {getSubjectAttendancePresent(
                        item.lectures,
                        studentData.id
                      )}
                      <Table
                        striped
                        bordered
                        hover
                        responsive
                        borderless
                        className="subjectAttendanceTable"
                        style={{ margin: 0 }}
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.lectures
                            .sort(sortLectureData)
                            .map((lecture, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{formatDate(lecture.time)}</td>
                                {checkPresentStatus(
                                  lecture.studentPresentIDs,
                                  studentData.id
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      )}
      {attendanceScanner && (
        <ScanCode
          handleCloseModal={() => setAttendanceScanner(false)}
          handleScanData={handleScanData}
        />
      )}
    </div>
  );
};

export default AttendanceDashboard;
