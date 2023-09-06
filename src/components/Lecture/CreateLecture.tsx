import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "@/css/Actions.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import StudentAttendance from "../Lecture/StudentAttendance";
import {
  getFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import subjectService from "@/services/subjectService";
import HeaderContext from "@/context/HeaderContext";
import studentService from "@/services/studentService";
import courseService from "@/services/courseService";
import teacherService from "@/services/teacherService";
import ReactDatePicker from "react-datepicker";

const CreateLecture = ({
  handleCloseModal,
  handleOnCreate,
  showModal,
  loading,
  subjectFilterOptions,
  courseFilterOptions,
  teacherFilterOptions,
}: any) => {
  const { userData }: any = useContext(HeaderContext);
  const navigate = useNavigate();
  const [createData, setCreateData]: any = useState({
    course: null,
    year: null,
    teacher: null,
    subject: null,
    studentsPresent: [],
    studentsAbsent: [],
    time: new Date(),
  });
  const [allStudents, setAllStudents]: any = useState([]);
  const [studentsLoading, setStudentsLoading]: any = useState(false);
  const [courseOptions, setCourseOptions]: any = useState(courseFilterOptions);
  const [teacherOptions, setTeacherOptions]: any =
    useState(teacherFilterOptions);
  const [subjectOptions, setSubjectOptions]: any =
    useState(subjectFilterOptions);

  useEffect(() => {
    if (createData.course && createData.year) {
      setStudentsLoading(true);
      // Getting subjects from backend
      subjectService
        .getAllSubjects({
          filter: {
            departmentID: userData.departmentID,
            year: createData.year.value,
            courseID: createData.course.value.id,
            teacherID: userData?.role !== "Admin" && userData.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setSubjectOptions(getFilterOptions(res.data));
          }
        });

      // Getting Students from backend
      studentService
        .getAllStudent({
          filter: {
            departmentID: userData.departmentID,
            year: createData.year.value,
            courseID: createData.course.value.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setStudentsLoading(false);
            setAllStudents(res.data);
          }
        });
    }
  }, [createData.course, createData.year]);

  const handleOnChange = (type: any, obj: any) => {
    if (type === "year" || type === "course") {
      setCreateData({
        ...createData,
        [type]: obj,
        teacher: null,
        subject: null,
      });
    } else {
      setCreateData({ ...createData, [type]: obj });
    }
  };

  const checkAllInput = () => {
    console.log("checking input");
    let checkInput = false;
    Object.keys(createData).forEach((key) => {
      if (userData.role !== "Admin" && key === "teacher") return;
      if (createData[key] === "" || !createData[key]) checkInput = true;
    });
    if (allStudents.length !== 0) checkInput = true;
    return checkInput;
  };

  console.log(createData);

  const handleOnChangeStudentsStatus = (
    action: string,
    type: string,
    student: any
  ) => {
    if (action === "add") {
      if (type === "present") {
        setCreateData({
          ...createData,
          studentsPresent: [...createData.studentsPresent, student],
        });
      } else {
        setCreateData({
          ...createData,
          studentsAbsent: [...createData.studentsAbsent, student],
        });
      }
    } else {
      if (type === "present") {
        setCreateData({
          ...createData,
          studentsPresent: [
            ...createData.studentsPresent.filter(
              (stud: any) => stud.id !== student.id
            ),
          ],
        });
      } else {
        setCreateData({
          ...createData,
          studentsAbsent: [
            ...createData.studentsAbsent.filter(
              (stud: any) => stud.id !== student.id
            ),
          ],
        });
      }
    }
  };

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
          Create Lecture
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflow: "scroll" }}>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal1`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Course
            </Form.Label>
            <Col>
              <Select
                defaultValue={{ value: "Default", label: "Select" }}
                onChange={(obj) => handleOnChange("course", obj)}
                options={courseOptions}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal2`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Year
            </Form.Label>
            <Col>
              <Select
                defaultValue={{ value: "Default", label: "Select" }}
                onChange={(obj) => handleOnChange("year", obj)}
                options={yearFilterOptions}
              />
            </Col>
          </Form.Group>
          {userData?.role === "Admin" && (
            <Form.Group as={Row} className="mb-3" controlId={`formHorizontal3`}>
              <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
                Teacher
              </Form.Label>
              <Col>
                <Select
                  defaultValue={{ value: "Default", label: "Select" }}
                  onChange={(obj) => handleOnChange("teacher", obj)}
                  options={teacherOptions}
                  value={createData.teacher}
                />
              </Col>
            </Form.Group>
          )}

          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal4`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Subject
            </Form.Label>
            <Col>
              <Select
                defaultValue={{ value: "Default", label: "Select" }}
                onChange={(obj) => handleOnChange("subject", obj)}
                options={subjectOptions}
                value={createData.subject}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal4`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Time
            </Form.Label>
            <Col>
              <ReactDatePicker
                selected={createData.time}
                onChange={(date: any) => handleOnChange("time", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="lectureTimePicker"
              />
            </Col>
          </Form.Group>

          {createData.course && createData.year && (
            <StudentAttendance
              studentsPresent={createData.studentsPresent}
              studentsAbsent={createData.studentsAbsent}
              handleOnChangeStudentsStatus={handleOnChangeStudentsStatus}
              allStudents={allStudents}
              setAllStudents={setAllStudents}
              studentsLoading={studentsLoading}
            />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          disabled={loading || checkAllInput()}
          onClick={() => handleOnCreate(createData)}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          Create{" "}
          {loading && (
            <Spinner
              animation="border"
              variant="light"
              style={{ height: "20px", width: "20px" }}
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateLecture;
