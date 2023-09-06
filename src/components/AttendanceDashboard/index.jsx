import React, { useContext, useState } from "react";
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
import { formatDate } from "@/utilities/usefulFunctions";

const AttendanceDashboard = () => {
  const { setLoadingModal } = useContext(HeaderContext);
  const [userUID, setUserUID] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const handleOnInputChange = (e) => {
    console.log(e);
    setUserUID(e.target.value);
  };
  const getStudentAttendance = () => {
    if (userUID === "") {
      toast.error("UID can't be empty !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (userUID.length < 6) {
      toast.error("UID length should be more than 6 !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    setLoadingModal(true);
    studentService
      .getStudentByUID(userUID)
      .then((res) => {
        console.log(res);
        if (res.data?.length > 0) {
          setStudentData(res.data[0]);
          const selectedStudent = res.data[0];
          let sem;
          const currentMonth = new Date().getMonth() + 1;
          if ([6, 7, 8, 9, 10].includes(currentMonth)) {
            if (selectedStudent.year === 1) sem = 1;
            else if (selectedStudent.year === 2) sem = 3;
            else sem = 5;
          } else {
            if (selectedStudent.year === 1) sem = 2;
            else if (selectedStudent.year === 2) sem = 4;
            else sem = 6;
          }
          sem = sem + "";
          studentService
            .getAttendance({ courseID: selectedStudent.courseID, sem: sem })
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
        } else {
          setLoadingModal(false);
          toast.error("No student present with this UID !", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          return;
        }
      })
      .catch((err) => {
        setLoadingModal(false);
        console.log(err);
        toast.error("Error Loading Attendance !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  return (
    <div className="dashboard">
      <h4 className="dashboardDate">Saturday, August 28</h4>
      <h1 className="dashboardUserName">
        Hello, Student <GiHand className="dashboardHand" />
      </h1>
      <div className="partitionLine"></div>
      <h3 className="dashboardHeading" style={{ fontSize: "1.4rem" }}>
        Check Your Attendance <BsTable />{" "}
      </h3>
      <div className="partitionLine"></div>
      <Form.Group as={Row} className="mb-3" controlId={`formHorizontal3`}>
        <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
          Student UID :
        </Form.Label>
        <Col>
          <Form.Control
            type="text"
            placeholder="Enter student UID"
            onChange={handleOnInputChange}
            value={userUID}
          />
        </Col>
        <Col style={{ display: "flex" }}>
          <Button onClick={getStudentAttendance}>Submit</Button>
        </Col>
      </Form.Group>
      <div className="partitionLine"></div>
      {attendanceData && (
        <>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "0.7rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 className="studentDataInfo">Name:</h2>
              <h2 className="studentDataInfo">Email:</h2>
              <h2 className="studentDataInfo">Year:</h2>
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
                          {item.lectures.map((lecture, index) => (
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
    </div>
  );
};

export default AttendanceDashboard;
