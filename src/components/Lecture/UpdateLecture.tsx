import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "@/css/Actions.css";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import StudentAttendance from "../Lecture/StudentAttendance";

import {
  getFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import HeaderContext from "@/context/HeaderContext";
import courseService from "@/services/courseService";
import teacherService from "@/services/teacherService";
import subjectService from "@/services/subjectService";
import studentService from "@/services/studentService";
import lectureService from "@/services/lectureService";
import { toast } from "react-toastify";
import { updateSourceFile } from "typescript";
import ReactDatePicker from "react-datepicker";

const UpdateLecture = ({
  handleCloseModal,
  selectedItem,
  showModal,
  disabled,
  handleOnUpdate,
  loading,
  subjectFilterOptions,
  courseFilterOptions,
  teacherFilterOptions,
}: any) => {
  const {
    userData,
    teachersData,
    setTeachersData,
    coursesData,
    setCoursesData,
  }: any = useContext(HeaderContext);
  const navigate = useNavigate();
  const [updateData, setUpdateData]: any = useState({
    course: null,
    year: null,
    teacher: null,
    subject: null,
    studentsPresent: [],
    studentsAbsent: [],
  });
  const [allStudents, setAllStudents]: any = useState([]);
  const [courseOptions, setCourseOptions]: any = useState(courseFilterOptions);
  const [teacherOptions, setTeacherOptions]: any =
    useState(teacherFilterOptions);
  const [subjectOptions, setSubjectOptions]: any =
    useState(subjectFilterOptions);
  const [studentsLoading, setStudentsLoading]: any = useState(false);

  useEffect(() => {
    if (courseOptions && teacherOptions) {
      let tempData = {
        course: courseOptions.find(
          (option: any) => option.value.id === selectedItem.courseID
        ),
        year: { label: selectedItem.year, value: selectedItem.year },
        teacher: teacherOptions.find(
          (option: any) => option.value.id === selectedItem.teacherID
        ),
        subject: subjectOptions.find(
          (option: any) => option.value.id === selectedItem.teacherID
        ),
        time: new Date(selectedItem.time),
      };
      setUpdateData({ ...updateData, ...tempData });
    }
  }, [courseOptions, teacherOptions, selectedItem]);

  useEffect(() => {
    if (updateData.course && updateData.year) {
      setStudentsLoading(true);
      // Getting subjects from backend
      subjectService
        .getAllSubjects({
          filter: {
            departmentID: userData.departmentID,
            year: updateData.year.value,
            courseID: updateData.course.value.id,
            teacherID: userData?.role !== "Admin" && userData.id,
          },
        })
        .then((subjectRes) => {
          console.log(subjectRes.data);
          if (subjectRes.data) {
            const tempSubjectsData = getFilterOptions(subjectRes.data);
            setSubjectOptions(tempSubjectsData);
            // Getting Students from backend
            studentService
              .getAllStudent({
                filter: {
                  departmentID: userData.departmentID,
                  year: updateData.year.value,
                  courseID: updateData.course.value.id,
                },
              })
              .then((res) => {
                console.log(res.data);
                if (res.data) {
                  setStudentsLoading(false);
                  const tempStudents = res.data;
                  const studentsPresent = tempStudents.filter((student: any) =>
                    selectedItem.studentPresentIDs?.includes(student.id)
                  );
                  const studentsAbsent = tempStudents.filter((student: any) =>
                    selectedItem.studentAbsentIDs?.includes(student.id)
                  );

                  const tempData = {
                    subject: tempSubjectsData.find(
                      (option: any) =>
                        option.value.id === selectedItem.subjectID
                    ),
                    studentsPresent: studentsPresent,
                    studentsAbsent: studentsAbsent,
                  };
                  console.log(tempData);
                  setUpdateData({ ...updateData, ...tempData });
                }
              });
          }
        });
    }
  }, [updateData.course, updateData.year]);

  const handleOnChange = (type: any, obj: any) => {
    if (type === "year" || type === "course") {
      setUpdateData({
        ...updateData,
        [type]: obj,
        teacher: null,
        subject: null,
      });
    } else {
      setUpdateData({ ...updateData, [type]: obj });
    }
  };

  const checkAllInput = () => {
    console.log("checking input");
    let checkInput = false;
    Object.keys(updateData).forEach((key) => {
      if (userData.role !== "Admin" && key === "teacher") return;
      if (updateData[key] === "" || !updateData[key]) checkInput = true;
    });
    if (allStudents.length !== 0) checkInput = true;
    return checkInput;
  };

  console.log(loading);

  console.log(updateData);

  const handleOnChangeStudentsStatus = (
    action: string,
    type: string,
    student: any
  ) => {
    if (action === "add") {
      if (type === "present") {
        setUpdateData({
          ...updateData,
          studentsPresent: [...updateData.studentsPresent, student],
        });
      } else {
        setUpdateData({
          ...updateData,
          studentsAbsent: [...updateData.studentsAbsent, student],
        });
      }
    } else {
      if (type === "present") {
        setUpdateData({
          ...updateData,
          studentsPresent: [
            ...updateData.studentsPresent.filter(
              (stud: any) => stud.id !== student.id
            ),
          ],
        });
      } else {
        setUpdateData({
          ...updateData,
          studentsAbsent: [
            ...updateData.studentsAbsent.filter(
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
      className="lecture-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {disabled ? "View" : "Update"} Lecture
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
                defaultValue={updateData.course}
                onChange={(obj) => handleOnChange("course", obj)}
                options={courseOptions}
                value={updateData.course}
                isDisabled={disabled}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal2`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Year
            </Form.Label>
            <Col>
              <Select
                defaultValue={updateData.year}
                onChange={(obj) => handleOnChange("year", obj)}
                options={yearFilterOptions}
                value={updateData.year}
                isDisabled={disabled}
              />
            </Col>
          </Form.Group>
          {userData.role === "Admin" && (
            <Form.Group as={Row} className="mb-3" controlId={`formHorizontal3`}>
              <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
                Teacher
              </Form.Label>
              <Col>
                <Select
                  defaultValue={updateData.teacher}
                  onChange={(obj) => handleOnChange("teacher", obj)}
                  options={teacherOptions}
                  value={updateData.teacher}
                  isDisabled={disabled}
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
                defaultValue={updateData.subject}
                onChange={(obj) => handleOnChange("subject", obj)}
                options={subjectOptions}
                value={updateData.subject}
                isDisabled={disabled}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId={`formHorizontal4`}>
            <Form.Label column sm={2} style={{ textTransform: "capitalize" }}>
              Time
            </Form.Label>
            <Col>
              <ReactDatePicker
                selected={updateData.time}
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

          {updateData.course && updateData.year && (
            <StudentAttendance
              studentsPresent={updateData.studentsPresent}
              studentsAbsent={updateData.studentsAbsent}
              handleOnChangeStudentsStatus={handleOnChangeStudentsStatus}
              allStudents={allStudents}
              setAllStudents={setAllStudents}
              isDisabled={disabled}
              studentsLoading={studentsLoading}
            />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!disabled && (
          <Button
            variant="success"
            disabled={loading || checkAllInput()}
            onClick={() => handleOnUpdate(updateData)}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            Update{" "}
            {loading && (
              <Spinner
                animation="border"
                variant="light"
                style={{ height: "20px", width: "20px" }}
              />
            )}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateLecture;
