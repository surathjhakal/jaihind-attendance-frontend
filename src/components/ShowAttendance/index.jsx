import studentService from "../../services/studentService";
import { response } from "express";
import React, { useEffect } from "react";
import { Accordion, Modal, Table } from "react-bootstrap";

const ShowAttendance = ({ handleCloseModal, selectedItem, showModal }) => {
  // useEffect(() => {
  //   let sem;
  //   const currentMonth = new Date().getMonth() + 1;
  //   if ([6, 7, 8, 9, 10].includes(currentMonth)) {
  //     if (selectedItem.year === 1) sem = 1;
  //     else if (selectedItem.year === 2) sem = 3;
  //     else sem = 5;
  //   } else {
  //     if (selectedItem.year === 1) sem = 2;
  //     else if (selectedItem.year === 2) sem = 4;
  //     else sem = 6;
  //   }
  //   studentService
  //     .getAttendance({ courseID: selectedItem.courseID, sem: sem })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);
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
        <Modal.Title id="contained-modal-title-vcenter">
          View Attendance - {selectedItem.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>MAD</Accordion.Header>
            <Accordion.Body style={{ padding: "1rem" }}>
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
                  <tr>
                    <td>1</td>
                    <td>10th August 2023</td>
                    <td>Present</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>11th August 2023</td>
                    <td>Present</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>12th August 2023</td>
                    <td>Absent</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>AI</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Unity</Accordion.Header>
            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Modal.Body>
    </Modal>
  );
};

export default ShowAttendance;
