import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import {
  getFilterOptions,
  semFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import {
  defaultFilter,
  selectDefaultFilter,
  studentFields,
} from "@/utilities/autoCompleteFields";
import courseService from "@/services/courseService";
import HeaderContext from "@/context/HeaderContext";
import studentService from "@/services/studentService";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import actionLogService from "@/services/actionLogService";
import ShowAttendance from "../ShowAttendance";
import { sortData } from "@/utilities/usefulFunctions";

const Student = (props) => {
  const { userData, setLoadingModal, setCoursesData } =
    useContext(HeaderContext);
  const [studentData, setStudentData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState(null);
  const [courseFilterOptions, setCourseFilterOptions] = useState([]);

  const [selectedYearFilter, setSelectedYearFilter] = useState(defaultFilter);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    courseService
      .getAllCourses({ filter: { departmentID: userData.departmentID } })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setCoursesData(res.data);
          setCourseFilterOptions(getFilterOptions(res.data));
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server Error", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  }, []);

  useEffect(() => {
    // The incoming Students Data will be filtered by departmentID from server
    if (selectedCourseFilter) {
      setLoadingModal(true);
      studentService
        .getAllStudent({
          filter: {
            departmentID: userData.departmentID,
            courseID: selectedCourseFilter.value.id,
          },
        })
        .then((res) => {
          console.log(res.data, typeof res.data);
          if (res.data) {
            const data = res.data;
            data.sort(sortData);
            setLoadingModal(false);
            setStudentData(data);
          }
        })
        .catch((error) => {
          console.log(error);
          setLoadingModal(true);
          toast.error("Server Error", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    }
  }, [selectedCourseFilter]);

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
    studentService
      .deleteStudent(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempStudentData = [...studentData].filter(
          (student) => student.id !== selectedItem.id
        );
        setStudentData(tempStudentData);
        setLoading(false);
        setShowModal(false);
        toast.success("Student Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted student ${selectedItem.name}`,
          actionType: "student",
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
    const courseID = createData.course.value.id;
    const studentObj = {
      id: uuidv4(),
      uid: createData.uid,
      name: createData.name,
      email: createData.email,
      courseID: courseID,
      year: createData.year.value,
      roll: createData.roll,
      major: createData.major,
      departmentID: userData.departmentID,
      creation_date: new Date().toISOString(),
    };
    studentService
      .createStudent(studentObj)
      .then((res) => {
        console.log(res);
        setStudentData([studentObj, ...studentData]);
        setLoading(false);
        setShowModal(false);
        toast.success("Student Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created student ${studentObj.name}`,
          actionType: "student",
          actionID: studentObj.id,
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
    const courseID = updateData.course.value.id;
    const studentObj = {
      id: selectedItem.id,
      uid: updateData.uid,
      name: updateData.name,
      email: updateData.email,
      courseID: courseID,
      year: updateData.year.value,
      roll: updateData.roll,
      major: updateData.major,
      departmentID: selectedItem.departmentID,
      creation_date: selectedItem.creation_date,
    };
    studentService
      .updateStudent(studentObj)
      .then((res) => {
        console.log(res);
        const tempStudentData = [...studentData].map((student) => {
          if (student.id === selectedItem.id) return studentObj;
          return student;
        });
        console.log(tempStudentData);
        setStudentData(tempStudentData);
        setLoading(false);
        setShowModal(false);
        toast.success("Student Updated!", {
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
    return data?.filter((item) =>
      selectedYearFilter.label === "All"
        ? true
        : item.year === selectedYearFilter.value
    );
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Student Section</h3>
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
        <div className="filtersSection">
          <div className="filterButton">
            <span>Course : </span>
            <Select
              defaultValue={selectDefaultFilter}
              onChange={setSelectedCourseFilter}
              options={courseFilterOptions}
              className="filterDropdown"
              value={selectedCourseFilter}
            />
          </div>
          <div className="filterButton">
            <span>Year : </span>
            <Select
              defaultValue={defaultFilter}
              onChange={setSelectedYearFilter}
              options={[defaultFilter, ...yearFilterOptions]}
              className="filterDropdown"
              value={selectedYearFilter}
              isDisabled={!selectedCourseFilter}
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
            <th>UID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData(studentData)?.map((studentDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{studentDoc.uid}</td>
              <td>{studentDoc.name}</td>
              <td>{studentDoc.email}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  className="viewButton"
                  onClick={() => handleShowModal("view", studentDoc)}
                >
                  View
                </Button>
                {userData?.role === "Admin" && (
                  <>
                    <Button
                      variant="warning"
                      className="updateButton"
                      onClick={() => handleShowModal("update", studentDoc)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      className="deleteButton"
                      onClick={() => handleShowModal("delete", studentDoc)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button
                  variant="info"
                  onClick={() => handleShowModal("attendance", studentDoc)}
                  style={{ background: "#cdfffc" }}
                >
                  Attendance
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
          type="student"
          fields={studentFields}
          coursesData={courseFilterOptions}
          loading={loading}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="student"
          fields={studentFields}
          coursesData={courseFilterOptions}
          disabled={true}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="student"
          fields={studentFields}
          coursesData={courseFilterOptions}
          loading={loading}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="student"
          loading={loading}
        />
      )}
      {showModal === "attendance" && (
        <ShowAttendance
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
        />
      )}
    </div>
  );
};

export default Student;
