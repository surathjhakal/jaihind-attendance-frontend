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
import { defaultFilter, subjectFields } from "@/utilities/autoCompleteFields";
import courseService from "@/services/courseService";
import HeaderContext from "@/context/HeaderContext";
import teacherService from "@/services/teacherService";
import subjectService from "@/services/subjectService";
import { toast } from "react-toastify";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import { v4 as uuidv4 } from "uuid";
import actionLogService from "@/services/actionLogService";

const Subject = () => {
  const { userData, setLoadingModal, setCoursesData, setTeachersData } =
    useContext(HeaderContext);
  const [subjectsData, setSubjectsData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedCourseFilter, setSelectedCourseFilter] =
    useState(defaultFilter);
  const [courseFilterOptions, setCourseFilterOptions] = useState([
    defaultFilter,
  ]);
  const [selectedTeacherFilter, setSelectedTeacherFilter] =
    useState(defaultFilter);
  const [teacherFilterOptions, setTeacherFilterOptions] = useState([
    defaultFilter,
  ]);

  const [selectedYearFilter, setSelectedYearFilter] = useState(defaultFilter);
  const [selectedSemFilter, setSelectedSemFilter] = useState(defaultFilter);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData.role === "Admin") {
      courseService
        .getAllCourses({ filter: { departmentID: userData.departmentID } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setCoursesData(res.data);
            const courseOptions = [
              defaultFilter,
              ...getFilterOptions(res.data),
            ];
            setCourseFilterOptions(courseOptions);
          }
        });
      teacherService
        .getAllTeacher({ filter: { departmentID: userData.departmentID } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setTeachersData(res.data);
            const teacherOptions = [
              defaultFilter,
              ...getFilterOptions(res.data),
            ];
            setTeacherFilterOptions(teacherOptions);
          }
        });
    } else {
      const courseIDs = userData.courseIDs;
      courseService
        .getAllCourses({ filter: { courseIDs: courseIDs } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setCoursesData(res.data);
            const courseOptions = [
              defaultFilter,
              ...getFilterOptions(res.data),
            ];
            setCourseFilterOptions(courseOptions);
          }
        });
    }
  }, []);

  useEffect(() => {
    // The incoming Students Data will be filtered by departmentID from server
    setLoadingModal(true);
    subjectService
      .getAllSubjects({
        filter: { departmentID: userData.departmentID, teacherID: userData.id },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setLoadingModal(false);
          setSubjectsData(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShowModal(false);
        toast.error("Error Occured !", {
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
    subjectService
      .deleteSubject(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempSubjectData = [...subjectsData].filter(
          (subject) => subject.id !== selectedItem.id
        );
        setSubjectsData(tempSubjectData);
        setLoading(false);
        setShowModal(false);
        toast.success("Subject Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted subject ${selectedItem.name}`,
          actionType: "subject",
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
    const teacherID =
      userData.role === "Admin" ? createData.teacher.value.id : userData.id;
    const year = createData.year.value;
    const sem = createData.sem.value;

    const subjectObj = {
      id: uuidv4(),
      name: createData.name,
      teacherID: teacherID,
      courseID: courseID,
      year: year,
      sem: sem,
      departmentID: userData.departmentID,
      creation_date: new Date().toISOString(),
    };
    subjectService
      .createSubject(subjectObj)
      .then((res) => {
        console.log(res);
        setSubjectsData([subjectObj, ...subjectsData]);
        setLoading(false);
        setShowModal(false);
        toast.success("Subject Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created subject ${subjectObj.name}`,
          actionType: "subject",
          actionID: subjectObj.id,
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
    console.log(updateData);
    setLoading(true);
    const courseID = updateData.course.value.id;
    const teacherID =
      userData.role === "Admin" ? updateData.teacher.value.id : userData.id;
    const year = updateData.year.value;
    const sem = updateData.sem.value;

    const subjectObj = {
      id: selectedItem.id,
      name: updateData.name,
      teacherFields: teacherID,
      courseID: courseID,
      year: year,
      sem: sem,
      departmentID: selectedItem.departmentID,
      creation_date: selectedItem.creation_date,
    };
    subjectService
      .updateSubject(subjectObj)
      .then((res) => {
        console.log(res);
        const tempSubjectData = [...subjectsData].map((subject) => {
          if (subject.id === selectedItem.id) return subjectObj;
          return subject;
        });
        setSubjectsData(tempSubjectData);
        setLoading(false);
        setShowModal(false);
        toast.success("Subject Updated!", {
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
    return data.filter(
      (item) =>
        (selectedCourseFilter.label === "All"
          ? true
          : item.courseID === selectedCourseFilter.value.id) &&
        (selectedTeacherFilter.label === "All"
          ? true
          : item.teacherID === selectedTeacherFilter.value.id) &&
        (selectedYearFilter.label === "All"
          ? true
          : item.year === selectedYearFilter.value) &&
        (selectedSemFilter.label === "All"
          ? true
          : item.sem === selectedSemFilter.value)
    );
  };

  const getTeacherName = (id) => {
    if (id === userData.id) {
      return userData.name;
    }
    const subject = teacherFilterOptions.find((subj) => subj.value.id === id);
    return subject?.value?.name;
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Subject Section</h3>
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
          {userData?.role === "Admin" && (
            <div className="filterButton">
              <span>Teacher : </span>
              <Select
                defaultValue={teacherFilterOptions}
                onChange={setSelectedTeacherFilter}
                options={teacherFilterOptions}
                className="filterDropdown"
              />
            </div>
          )}
          <div className="filterButton">
            <span>Year : </span>
            <Select
              defaultValue={selectedYearFilter}
              onChange={setSelectedYearFilter}
              options={[defaultFilter, ...yearFilterOptions]}
              className="filterDropdown"
            />
          </div>
          <div className="filterButton">
            <span>Sem : </span>
            <Select
              defaultValue={selectedSemFilter}
              onChange={setSelectedSemFilter}
              options={[defaultFilter, ...semFilterOptions]}
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
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData(subjectsData)?.map((subjectDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{subjectDoc.name}</td>
              <td>{getTeacherName(subjectDoc.teacherID)}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  onClick={() => handleShowModal("view", subjectDoc)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("update", subjectDoc)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", subjectDoc)}
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
          type="subject"
          fields={subjectFields}
          loading={loading}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="subject"
          fields={subjectFields}
          disabled={true}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="subject"
          fields={subjectFields}
          loading={loading}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="subject"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Subject;
