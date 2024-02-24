import HeaderContext from "@/context/HeaderContext";
import studentService from "../../services/studentService";
import React, { useEffect, useContext, useState } from "react";
import { Accordion, Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  checkPresentStatus,
  getOverallAttendancePrecentage,
  getSubjectAttendancePresent,
} from "@/utilities/studentAttendance";
import {
  formatDate,
  sortData,
  sortLectureData,
} from "@/utilities/usefulFunctions";

const ShowAttendance = ({ handleCloseModal, selectedItem, showModal }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadAttendance, setLoadAttendance] = useState(false);

  useEffect(() => {
    setLoadAttendance(true);
    let sem;
    const currentMonth = new Date().getMonth() + 1;
    if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].includes(currentMonth)) {
      if (selectedItem.year === 1) sem = 1;
      else if (selectedItem.year === 2) sem = 3;
      else sem = 5;
    } else {
      if (selectedItem.year === 1) sem = 2;
      else if (selectedItem.year === 2) sem = 4;
      else sem = 6;
    }
    sem = sem + "";
    studentService
      .getAttendance({
        courseID: selectedItem.courseID,
        sem: sem,
        studentID: selectedItem.id,
      })
      .then((res) => {
        setLoadAttendance(false);
        setAttendanceData(res.data);
        console.log(res);
      })
      .catch((err) => {
        setLoadAttendance(false);
        console.log(err);
        toast.error("Error Loading Attendance !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  }, []);

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: "#6e6e6e", fontWeight: 400 }}
        >
          View Attendance -{" "}
          <span style={{ color: "#494949", fontWeight: 500 }}>
            {selectedItem.name}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {loadAttendance ? (
          <div className="loadingModalCircles">
            <div className="loadingModalCircle"></div>
            <div className="loadingModalCircle"></div>
          </div>
        ) : (
          <>
            <h2>
              {getOverallAttendancePrecentage(attendanceData, selectedItem.id)}{" "}
            </h2>
            <Accordion style={{ width: "100%" }}>
              {attendanceData?.length === 0 && (
                <h1
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  No Attendance
                </h1>
              )}
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
                          selectedItem.id
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
                                    selectedItem.id
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
      </Modal.Body>
    </Modal>
  );
};

export default ShowAttendance;
