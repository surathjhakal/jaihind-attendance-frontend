import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "@/css/Actions.css";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getFilterOptions,
  semFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import HeaderContext from "@/context/HeaderContext";
import departmentService from "@/services/departmentService";
import courseService from "@/services/courseService";
import teacherService from "@/services/teacherService";
import subjectService from "@/services/subjectService";
import { toast } from "react-toastify";

const UpdateAction = ({
  handleCloseModal,
  handleOnUpdate,
  selectedItem,
  showModal,
  type,
  fields,
  disabled,
  loading,
  teachersData,
  departmentsData,
  coursesData,
  subjectsData,
}) => {
  const { userData } = useContext(HeaderContext);
  const [updateData, setUpdateData] = useState({});

  const getOptionsList = (value) => {
    if (value === "department") {
      return departmentsData;
    } else if (value === "course") {
      return coursesData;
    } else if (value === "year") {
      return yearFilterOptions;
    } else if (value === "sem") {
      return semFilterOptions;
    } else if (value === "teacher") {
      return teachersData;
    } else if (value === "subject") {
      return subjectsData;
    }
  };

  console.log(updateData);
  console.log(coursesData);

  const handleOnChange = (type, value) => {
    setUpdateData({ ...updateData, [type]: value });
  };

  const getID = (value) => {
    if (value === "department") return selectedItem.departmentID;
    else if (value === "teacher") return selectedItem.teacherID;
    else if (value === "subject") return selectedItem.subjectID;
    else if (value === "course")
      return selectedItem.courseID || selectedItem.courseIDs;
    else if (value === "admin") return selectedItem.adminID;
    else if (value === "year") return selectedItem.year;
    else if (value === "sem") return selectedItem.sem;
  };

  useEffect(() => {
    if (type === "course" && !teachersData && userData.role !== "Admin") return;
    if (type === "teacher" && !coursesData) return;
    if (type === "subject" && !teachersData && !coursesData) return;
    if (type === "admin" && !departmentsData) return;
    let tempUpdateData = {};
    fields.forEach((field) => {
      if (field.type === "password") return;
      if (field.type === "dropdown") {
        console.log(getOptionsList(field.value));
        tempUpdateData = {
          ...tempUpdateData,
          [field.value]:
            field.value === "course" && type === "teacher"
              ? getOptionsList(field.value).filter((option) =>
                  getID(field.value).includes(option.value.id)
                )
              : getOptionsList(field.value).find(
                  (option) =>
                    option.value.id === getID(field.value) ||
                    option.value === getID(field.value)
                ),
        };
      } else {
        tempUpdateData = {
          ...tempUpdateData,
          [field.value]: selectedItem[field.value],
        };
      }
    });
    setUpdateData(tempUpdateData);
  }, [fields, selectedItem, teachersData, subjectsData, coursesData]);

  const checkAllInput = () => {
    console.log("checking input");
    let checkInput = false;
    Object.keys(updateData).forEach((key) => {
      if (userData.role !== "Admin" && key === "teacher") return;
      if (
        updateData[key] === "" ||
        !updateData[key] ||
        updateData[key]?.length == 0
      )
        checkInput = true;
    });

    return checkInput;
  };

  const onUpdate = () => {
    handleOnUpdate(updateData);
  };
  console.log(updateData.course);

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
          {disabled ? "View" : "Update"} {type}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field, index) => {
            if (field.type === "password") return;
            return (
              <Form.Group
                as={Row}
                className="mb-3"
                controlId={`formHorizontal${index}`}
              >
                <Form.Label
                  column
                  sm={2}
                  style={{ textTransform: "capitalize" }}
                >
                  {field.value}
                </Form.Label>
                <Col>
                  {field.type === "text" ? (
                    <Form.Control
                      type="text"
                      placeholder={field.value}
                      onChange={(e) =>
                        handleOnChange(field.value, e.target.value)
                      }
                      value={updateData[field.value]}
                      disabled={disabled}
                    />
                  ) : field.type === "email" ? (
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      onChange={(e) => handleOnChange("email", e.target.value)}
                      value={updateData[field.value]}
                      disabled={disabled}
                    />
                  ) : (
                    field.type === "dropdown" &&
                    (field.isMulti ? (
                      <Select
                        defaultValue={updateData[field.value]}
                        onChange={(value) => handleOnChange(field.value, value)}
                        options={getOptionsList(field.value)}
                        isDisabled={disabled}
                        value={updateData[field.value]}
                        isMulti
                      />
                    ) : (
                      <Select
                        defaultValue={updateData[field.value]}
                        onChange={(value) => handleOnChange(field.value, value)}
                        options={getOptionsList(field.value)}
                        value={updateData[field.value]}
                        isDisabled={disabled}
                      />
                    ))
                  )}
                </Col>
              </Form.Group>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {!disabled && (
          <Button
            variant="success"
            disabled={loading || checkAllInput()}
            onClick={onUpdate}
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

export default UpdateAction;
