import { useEffect, useState, useContext } from "react";
import {
  Accordion,
  Button,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import "@/css/Actions.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import HeaderContext from "@/context/HeaderContext";
import {
  semFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import { toast } from "react-toastify";
import studentService from "@/services/studentService";
import { sortStudents } from "@/utilities/usefulFunctions";

const CreateAction = ({
  handleCloseModal,
  handleOnCreate,
  showModal,
  type,
  fields,
  loading,
  teachersData,
  departmentsData,
  coursesData,
  subjectsData,
}: any) => {
  const { userData }: any = useContext(HeaderContext);
  const navigate = useNavigate();
  const [createData, setCreateData]: any = useState({});
  const [studentsInfo, setStudentsInfo]: any = useState(null);

  console.log(createData);

  useEffect(() => {
    if (
      createData.teacher?.length > 1 &&
      createData.course &&
      createData.year &&
      studentsInfo &&
      type === "subject"
    ) {
      let average = studentsInfo?.length / createData.teacher?.length;
      let start = 0;
      let last = average;
      const batches: any = {};
      for (let i = 0; i < createData.teacher?.length; i++) {
        batches[createData.teacher[i].value.id] = studentsInfo.slice(
          start,
          last
        );
        start = last;
        last = last + average;
      }
      setCreateData({ ...createData, batches: batches });
    } else if (createData.teacher?.length <= 1) {
      setCreateData({ ...createData, batches: null });
    }
  }, [createData.teacher, studentsInfo]);

  useEffect(() => {
    if (
      createData.teacher?.length > 1 &&
      createData.course &&
      createData.year &&
      type === "subject"
    ) {
      studentService
        .getAllStudent({
          filter: {
            departmentID: userData.departmentID,
            courseID: createData.course.value.id,
            year: createData.year.value,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data) {
            setStudentsInfo(sortStudents(res.data));
          }
        });
    }
  }, [createData.course, createData.year]);

  const getOptionsList = (value: string) => {
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
    console.log(createData);
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
      if (key === "batches") checkInput = false;
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

  const getTeacherName = (id: any) => {
    const teacher: any = createData.teacher.find(
      (teacher: any) => teacher.value.id === id
    );
    return teacher?.value?.name;
  };

  const getMoveButttons = (currentIndex: any, teacherKey: any) => {
    let tempBatches: any = JSON.parse(JSON.stringify(createData.batches));
    const handleMove = (moveKey: any) => {
      const student: any = tempBatches[teacherKey].splice(currentIndex, 1);
      tempBatches[moveKey].push(student[0]);
      setCreateData({ ...createData, batches: tempBatches });
    };
    return (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {Object.keys(createData.batches).map(
          (key: any, index: any) =>
            key !== teacherKey && (
              <Button variant="primary" onClick={() => handleMove(key)}>
                {index + 1}
              </Button>
            )
        )}
      </div>
    );
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

          <div className="partitionLine"></div>

          {createData.batches && (
            <div className="studentBatches">
              <h3>Batches</h3>
              <Accordion>
                {createData.batches &&
                  Object.keys(createData.batches).map((key, keyIndex) => (
                    <Accordion.Item eventKey={key}>
                      <Accordion.Header>
                        Batch {keyIndex + 1}- {getTeacherName(key)} -{" "}
                        {createData.batches[key]?.length} students
                      </Accordion.Header>
                      <Accordion.Body
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        {createData.batches[key].map(
                          (student: any, index: any) => (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>{`${index + 1}) ${student.name} - ${
                                student.uid
                              }`}</p>
                              {getMoveButttons(index, key)}
                            </div>
                          )
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </div>
          )}

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
