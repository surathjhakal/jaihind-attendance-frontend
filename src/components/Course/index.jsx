import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import courseService from "@/services/courseService";
import HeaderContext from "@/context/HeaderContext";
import { toast } from "react-toastify";
import CreateAction from "../Actions/CreateAction";
import { courseFields } from "@/utilities/autoCompleteFields";
import { v4 as uuidv4 } from "uuid";
import UpdateAction from "../Actions/UpdateAction";
import actionLogService from "@/services/actionLogService";
import { sortData } from "@/utilities/usefulFunctions";

const Course = (props) => {
  const { userData, setLoadingModal } = useContext(HeaderContext);
  const [courseData, setCourseData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadingModal(true);
    courseService
      .getAllCourses({
        filter: {
          departmentID: userData?.role === "Admin" && userData.departmentID,
          courseIDs: userData?.role !== "Admin" && userData.courseIDs,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          const data = res.data;
          data.sort(sortData);
          setLoadingModal(false);
          setCourseData(data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingModal(false);
        toast.error("Server Error", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  }, []);

  const handleShowModal = (type, courseDoc) => {
    setSelectedItem(courseDoc);
    setShowModal(type);
  };
  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleOnDelete = () => {
    setLoading(true);
    console.log("Document deleted successfull");
    courseService
      .deleteCourse(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempCourseData = [...courseData].filter(
          (course) => course.id !== selectedItem.id
        );
        setCourseData(tempCourseData);
        setLoading(false);
        setShowModal(false);
        toast.success("Course Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted course ${selectedItem.name}`,
          actionType: "course",
          actionID: selectedItem.id,
          userID: userData.id,
          departmentID: userData.departmentID,
          creation_date: new Date().toISOString(),
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShowModal(false);
        toast.error("Error Occured !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const handleOnCreate = (createData) => {
    setLoading(true);
    const courseObj = {
      id: uuidv4(),
      name: createData.name,
      departmentID: userData.departmentID,
      creation_date: new Date().toISOString(),
    };
    courseService
      .createCourse(courseObj)
      .then((res) => {
        console.log(res);
        setCourseData([courseObj, ...courseData]);
        setLoading(false);
        setShowModal(false);
        toast.success("Course Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created course ${courseObj.name}`,
          actionType: "course",
          actionID: courseObj.id,
          userID: userData.id,
          departmentID: userData.departmentID,
          creation_date: new Date().toISOString(),
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShowModal(false);
        toast.error("Error Occured !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  const handleOnUpdate = (updateData) => {
    setLoading(true);
    const courseObj = {
      id: selectedItem.id,
      name: updateData.name,
      departmentID: selectedItem.departmentID,
      creation_date: selectedItem.creation_date,
    };
    courseService
      .updateCourse(courseObj)
      .then((res) => {
        console.log(res);
        const tempCourseData = [...courseData].map((course) => {
          if (course.id === selectedItem.id) return courseObj;
          return course;
        });
        setCourseData(tempCourseData);
        setLoading(false);
        setShowModal(false);
        toast.success("Course Updated!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShowModal(false);
        toast.error("Error Occured !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Course Section</h3>
        {userData?.role === "Admin" && (
          <Button
            variant="primary"
            className="createButton"
            onClick={() => handleShowModal("create", null)}
          >
            Create
          </Button>
        )}
      </div>
      <div className="partitionLine"></div>
      <div className="dashboardHeadingSection2">
        <h3 className="dashboardHeading">Filters</h3>
      </div>
      <div className="partitionLine"></div>
      <Table
        striped
        bordered
        hover
        responsive
        borderless
        className="tableDataBox"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courseData?.map((courseDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{courseDoc.name}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  className="viewButton"
                  onClick={() => handleShowModal("view", courseDoc)}
                >
                  View
                </Button>
                {userData?.role === "Admin" && (
                  <>
                    <Button
                      variant="warning"
                      className="updateButton"
                      onClick={() => handleShowModal("update", courseDoc)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      className="deleteButton"
                      onClick={() => handleShowModal("delete", courseDoc)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal === "create" && (
        <CreateAction
          handleCloseModal={handleCloseModal}
          handleOnCreate={handleOnCreate}
          showModal={showModal}
          type="course"
          fields={courseFields}
          loading={loading}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="course"
          fields={courseFields}
          disabled={true}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="course"
          fields={courseFields}
          loading={loading}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="course"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Course;
