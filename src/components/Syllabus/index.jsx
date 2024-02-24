import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Modal, Spinner } from "react-bootstrap";
import HeaderContext from "@/context/HeaderContext";
import studentService from "@/services/studentService";
import { sortData, sortSyllabus } from "@/utilities/usefulFunctions";
import syllabusService from "@/services/syllabusService";
import { IoMdAdd } from "react-icons/io";
import { MdDelete, MdOutlinePendingActions } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

const Syllabus = ({
  handleCloseModal,
  selectedItem,
  showModal,
  handleOnUpdate,
  loading,
}) => {
  const { userData } = useContext(HeaderContext);
  const [syllabusList, setSyllabusList] = useState([]);

  useEffect(() => {
    syllabusService
      .getSyllabus({
        filter: {
          subjectID: selectedItem.id,
          teacherID: userData.id,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.data) {
          setSyllabusList(res.data.sort(sortData));
        }
      });
  }, []);

  const handleOnChangeSubTask = (e, index, taskIndex) => {
    const syllabus = [...syllabusList];
    syllabus[index].tasks[taskIndex].name = e.target.value;
    setSyllabusList(syllabus);
  };

  const handleOnChangeTask = (e, taskIndex) => {
    const syllabus = [...syllabusList];
    syllabus[taskIndex].name = e.target.value;
    setSyllabusList(syllabus);
  };

  const handleOnAddTask = () => {
    const syllabus = [...syllabusList];
    syllabus.push({
      name: "New Task",
      tasks: [],
    });
    setSyllabusList(syllabus);
  };

  const handleOnAddSubTask = (index) => {
    const syllabus = [...syllabusList];
    syllabus[index].tasks.push({
      name: "Task " + (syllabus[index].tasks.length + 1),
      status: "Pending",
      order:
        syllabus[index].tasks[syllabus[index].tasks.length - 1]?.order + 1 || 1,
    });
    setSyllabusList(syllabus);
  };

  const handleOnDeleteTask = (index) => {
    const syllabus = [...syllabusList];
    syllabus.splice(index, 1);
    setSyllabusList(syllabus);
  };

  const handleOnDeleteSubTask = (index, taskIndex) => {
    const syllabus = [...syllabusList];
    syllabus[index].tasks.splice(taskIndex, 1);
    setSyllabusList(syllabus);
  };

  const handleOnChangeStatus = (index, taskIndex, status) => {
    const syllabus = [...syllabusList];
    syllabus[index].tasks[taskIndex].status = status;
    setSyllabusList(syllabus);
  };

  const getTaskStatus = (index) => {
    const syllabus = [...syllabusList];
    const getItems = syllabus[index].tasks.filter(
      (task) => task.status == "Pending"
    );

    if (getItems.length > 0) return "pending";
    return "complete";
  };

  return (
    <Modal
      show={showModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <p style={{ margin: 0 }}>Syllabus List</p>
            <Button variant="primary" onClick={handleOnAddTask}>
              <IoMdAdd />
            </Button>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Accordion>
          {syllabusList.map((syllabus, index) => (
            <Accordion.Item eventKey={index}>
              <Accordion.Header
                className={`accordian-${getTaskStatus(index)}`}
                style={{ background: "transparent" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    value={syllabus.name}
                    onChange={(e) => handleOnChangeTask(e, index)}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      padding: "0 0.5rem",
                    }}
                  />{" "}
                  <div style={{ display: "flex", gap: "4px", margin: "0 4px" }}>
                    <Button onClick={() => handleOnAddSubTask(index)}>
                      <IoMdAdd />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleOnDeleteTask(index)}
                    >
                      <MdDelete />
                    </Button>
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {syllabus.tasks?.map((task, taskIndex) => (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      border: `1px solid ${
                        task.status === "Complete" ? "green" : "orange"
                      }`,
                      boxShadow: `0 0 4px ${
                        task.status === "Complete" ? "green" : "orange"
                      }`,
                      padding: "0.3rem",
                    }}
                  >
                    <input
                      value={task.name}
                      onChange={(e) =>
                        handleOnChangeSubTask(e, index, taskIndex)
                      }
                      style={{ flex: 1, border: "none", outline: "none" }}
                    />
                    <div
                      style={{ display: "flex", gap: "8px", margin: "0 4px" }}
                    >
                      <Button
                        variant="danger"
                        onClick={() => handleOnDeleteSubTask(index, taskIndex)}
                      >
                        <MdDelete />
                      </Button>
                      {task.status !== "Complete" ? (
                        <Button
                          variant="success"
                          onClick={() =>
                            handleOnChangeStatus(index, taskIndex, "Complete")
                          }
                        >
                          <FaCheck />
                        </Button>
                      ) : (
                        <Button
                          variant="warning"
                          onClick={() =>
                            handleOnChangeStatus(index, taskIndex, "Pending")
                          }
                        >
                          <MdOutlinePendingActions />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          disabled={loading}
          onClick={() => handleOnUpdate(syllabusList)}
          variant="success"
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
      </Modal.Footer>
    </Modal>
  );
};

export default Syllabus;
