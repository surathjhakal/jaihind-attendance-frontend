import { useEffect, useState, useContext } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import "@/css/Actions.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import teacherService from "@/services/teacherService";
import HeaderContext from "@/context/HeaderContext";
import {
  getFilterOptions,
  semFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import departmentService from "@/services/departmentService";
import courseService from "@/services/courseService";
import subjectService from "@/services/subjectService";
import { toast } from "react-toastify";

const CreateAction = ({
  handleCloseModal,
  handleOnCreate,
  showModal,
  type,
  fields,
  loading,
}: any) => {
  const {
    userData,
    teachersData,
    setTeachersData,
    departmentsData,
    setDepartmentsData,
    coursesData,
    setCoursesData,
    subjectsData,
    setSubjectsData,
  }: any = useContext(HeaderContext);
  const navigate = useNavigate();
  const [createData, setCreateData]: any = useState({});

  console.log(createData.course, createData.year);

  const getOptionsList = (value: string) => {
    if (value === "department") {
      if (departmentsData) {
        return getFilterOptions(departmentsData);
      } else {
        departmentService.getAllDepartments().then((res) => {
          console.log(res.data);
          if (res.data) {
            setDepartmentsData(res.data);
            return getFilterOptions(res.data);
          }
        });
      }
    } else if (value === "course") {
      if (coursesData) {
        return getFilterOptions(coursesData);
      } else {
        courseService
          .getAllCourses({ filter: { departmentID: userData.departmentID } })
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              setCoursesData(res.data);
              return getFilterOptions(res.data);
            }
          });
      }
    } else if (value === "year") {
      return yearFilterOptions;
    } else if (value === "sem") {
      return semFilterOptions;
    } else if (value === "teacher") {
      if (teachersData) {
        return getFilterOptions(teachersData);
      } else {
        teacherService
          .getAllTeacher({ filter: { departmentID: userData.departmentID } })
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              setTeachersData(res.data);
              return getFilterOptions(res.data);
            }
          });
      }
    } else if (value === "subject") {
      if (subjectsData) {
        return getFilterOptions(subjectsData);
      } else {
        subjectService
          .getAllSubjects({ filter: { departmentID: userData.departmentID } })
          .then((res) => {
            console.log(res.data);
            if (res.data) {
              setSubjectsData(res.data);
              return getFilterOptions(res.data);
            }
          });
      }
    }
  };

  const handleOnChange = (type: any, value: any) => {
    setCreateData({ ...createData, [type]: value });
  };

  useEffect(() => {
    let tempCreateData = {};
    fields.forEach((field: any) => {
      if (field.type === "dropdown") {
        tempCreateData = {
          ...tempCreateData,
          [field.value]: null,
        };
      } else {
        tempCreateData = { ...tempCreateData, [field.value]: "" };
      }
    });
    setCreateData(tempCreateData);
  }, [fields]);

  const checkAllInput = () => {
    console.log("checking input");
    let checkInput = false;
    Object.keys(createData).forEach((key) => {
      console.log(key, createData[key]);
      if (userData.role !== "Admin" && key === "teacher") return;
      if (
        createData[key] === "" ||
        !createData[key] ||
        createData[key]?.length == 0
      )
        checkInput = true;
    });

    return checkInput;
  };

  const goBack = () => {
    navigate(-1);
  };

  const onCreate = () => {
    if (type === "admin" && createData.password.length < 6) {
      toast.error("Password length should be atleast 6 !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      handleOnCreate(createData);
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
          Create {type}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field: any, index: any) => {
            if (userData.role !== "Admin" && field.value === "teacher") return;
            return (
              <Form.Group
                as={Row}
                className="mb-3"
                controlId={`formHorizontal${index}`}
                key={index}
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
                      value={createData[field.value]}
                    />
                  ) : field.type === "email" ? (
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      onChange={(e) => handleOnChange("email", e.target.value)}
                      value={createData[field.value]}
                    />
                  ) : field.type === "password" ? (
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={(e) =>
                        handleOnChange("password", e.target.value)
                      }
                      value={createData[field.value]}
                    />
                  ) : (
                    field.type === "dropdown" && (
                      <Select
                        defaultValue={
                          field.isMulti
                            ? null
                            : { value: "Default", label: "Select" }
                        }
                        onChange={(value) => handleOnChange(field.value, value)}
                        options={getOptionsList(field.value)}
                        isMulti={field.isMulti}
                      />
                    )
                  )}
                </Col>
              </Form.Group>
            );
          })}

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }} className="actionButtons">
              <Button
                variant="success"
                disabled={loading || checkAllInput()}
                onClick={onCreate}
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
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateAction;
