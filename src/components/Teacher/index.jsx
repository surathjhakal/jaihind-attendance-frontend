import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import { getFilterOptions } from "@/utilities/autoCompleteOptions";
import { defaultFilter, teacherFields } from "@/utilities/autoCompleteFields";
import courseService from "@/services/courseService";
import HeaderContext from "@/context/HeaderContext";
import teacherService from "@/services/teacherService";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import actionLogService from "@/services/actionLogService";
import { sortData } from "@/utilities/usefulFunctions";

const Teacher = (props) => {
  const { userData, setLoadingModal, setCoursesData } =
    useContext(HeaderContext);
  const [teacherData, setTeacherData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedCourseFilter, setSelectedCourseFilter] =
    useState(defaultFilter);
  const [courseFilterOptions, setCourseFilterOptions] = useState([
    defaultFilter,
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseService
      .getAllCourses({ filter: { departmentID: userData.departmentID } })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          const data = res.data;
          setCoursesData(data);
          const courseOptions = [defaultFilter, ...getFilterOptions(data)];
          setCourseFilterOptions(courseOptions);
        }
      });
  }, []);

  useEffect(() => {
    // The incoming Teachers Data will be filtered by departmentID from server
    setLoadingModal(true);
    teacherService
      .getAllTeacher({ filter: { departmentID: userData.departmentID } })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          const data = res.data;
          data.sort(sortData);
          setLoadingModal(false);
          setTeacherData(data);
        }
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
    teacherService
      .deleteTeacher(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempTeachersData = [...teacherData].filter(
          (teacher) => teacher.id !== selectedItem.id
        );
        setTeacherData(tempTeachersData);
        setLoading(false);
        setShowModal(false);
        toast.success("Teacher Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted teacher ${selectedItem.name}`,
          actionType: "teacher",
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
    const courseIDs = createData.course.map((course) => course.value.id);
    const teacherObj = {
      id: uuidv4(),
      name: createData.name,
      email: createData.email,
      password: createData.password,
      adminID: userData.adminID || userData.id,
      courseIDs: courseIDs,
      departmentID: userData.departmentID,
      creation_date: new Date().toISOString(),
    };
    teacherService
      .createTeacher(teacherObj)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setShowModal(false);
        setTeacherData([teacherObj, ...teacherData]);
        toast.success("Teacher Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created teacher ${teacherObj.name}`,
          actionType: "teacher",
          actionID: teacherObj.id,
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
    const courseIDs = updateData.course.map((course) => course.value.id);
    const teacherObj = {
      id: selectedItem.id,
      name: updateData.name,
      email: updateData.email,
      password: updateData.password,
      adminID: selectedItem.adminID,
      courseIDs: courseIDs,
      departmentID: selectedItem.departmentID,
      creation_date: selectedItem.creation_date,
    };
    teacherService
      .updateTeacher(teacherObj)
      .then((res) => {
        console.log(res);
        const tempTeacherData = [...teacherData].map((teacher) => {
          if (teacher.id === selectedItem.id) return teacherObj;
          return teacher;
        });
        setLoading(false);
        setShowModal(false);
        setTeacherData(tempTeacherData);
        toast.success("Teacher Updated!", {
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

  const filterData = (data) => {
    return data.filter((item) =>
      selectedCourseFilter.label === "All"
        ? true
        : item.courseIDs.includes(selectedCourseFilter.value.id)
    );
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Teacher Section</h3>
        <Button
          variant="primary"
          className="createButton"
          onClick={() => handleShowModal("create", null)}
        >
          Create
        </Button>
      </div>
      <div className="partitionLine"></div>
      <div className="dashboardHeadingSection2">
        <h3 className="dashboardHeading">Filters</h3>
        <div className="filtersSection">
          <div className="filterButton">
            <span>Course : </span>
            <Select
              defaultValue={selectedCourseFilter}
              onChange={setSelectedCourseFilter}
              options={courseFilterOptions}
              className="filterDropdown"
            />
          </div>
        </div>
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
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData(teacherData)?.map((teacherDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{teacherDoc.name}</td>
              <td>{teacherDoc.email}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  className="viewButton"
                  onClick={() => handleShowModal("view", teacherDoc)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  className="updateButton"
                  onClick={() => handleShowModal("update", teacherDoc)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  className="deleteButton"
                  onClick={() => handleShowModal("delete", teacherDoc)}
                >
                  Delete
                </Button>
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
          type="teacher"
          fields={teacherFields}
          loading={loading}
          coursesData={courseFilterOptions}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="teacher"
          fields={teacherFields}
          disabled={true}
          coursesData={courseFilterOptions}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="teacher"
          fields={teacherFields}
          loading={loading}
          coursesData={courseFilterOptions}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="teacher"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Teacher;
