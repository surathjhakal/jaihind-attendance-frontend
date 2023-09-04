import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import { defaultFilter } from "@/utilities/autoCompleteFields";
import {
  getFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import courseService from "@/services/courseService";
import teacherService from "@/services/teacherService";
import HeaderContext from "@/context/HeaderContext";
import subjectService from "@/services/subjectService";
import lectureService from "@/services/lectureService";
import { toast } from "react-toastify";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import { v4 as uuidv4 } from "uuid";
import CreateLecture from "./CreateLecture";
import UpdateLecture from "./UpdateLecture";
import actionLogService from "@/services/actionLogService";

type Props = {};

const Lecture = (props: Props) => {
  const { userData, setLoadingModal }: any = useContext(HeaderContext);
  const [lectureData, setLectureData]: any = useState([]);
  const [showModal, setShowModal]: any = useState(null);
  const [selectedItem, setSelectedItem]: any = useState(null);

  const [selectedCourseFilter, setSelectedCourseFilter]: any = useState();
  const [courseFilterOptions, setCourseFilterOptions] = useState([]);
  const [selectedYearFilter, setSelectedYearFilter]: any = useState();

  const [selectedSubjectFilter, setSelectedSubjectFilter]: any =
    useState(defaultFilter);
  const [subjectFilterOptions, setSubjectFilterOptions] = useState([
    defaultFilter,
  ]);

  const [selectedTeacherFilter, setSelectedTeacherFilter]: any =
    useState(defaultFilter);
  const [teacherFilterOptions, setTeacherFilterOptions] = useState([
    defaultFilter,
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCourseFilter && selectedYearFilter) {
      setLoadingModal(true);
      subjectService
        .getAllSubjects({
          filter: {
            departmentID: userData.departmentID,
            year: selectedYearFilter.value,
            courseID: selectedCourseFilter.value.id,
            teacherID: userData?.role !== "Admin" && userData.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setSubjectFilterOptions([
              defaultFilter,
              ...getFilterOptions(res.data),
            ]);
          }
        });

      lectureService
        .getAllLectures({
          filter: {
            departmentID: userData.departmentID,
            year: selectedYearFilter.value,
            courseID: selectedCourseFilter.value.id,
            teacherID: userData?.role !== "Admin" && userData.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setLoadingModal(false);
            setLectureData(res.data);
          }
        });
    }
  }, [selectedCourseFilter, selectedYearFilter]);

  useEffect(() => {
    setLoadingModal(true);
    if (userData.role === "Admin") {
      courseService
        .getAllCourses({ filter: { departmentID: userData.departmentID } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setLoadingModal(false);
            setCourseFilterOptions(getFilterOptions(res.data));
          }
        });
      teacherService
        .getAllTeacher({ filter: { departmentID: userData.departmentID } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            const teacherOptions = [
              defaultFilter,
              ...getFilterOptions(res.data),
            ];
            setTeacherFilterOptions(teacherOptions);
          }
        });
    } else {
      const courseIDs: any = userData.courseIDs;
      courseService
        .getAllCourses({ filter: { courseIDs: courseIDs } })
        .then((res) => {
          console.log(res.data);
          if (res.data) {
            setLoadingModal(false);
            setCourseFilterOptions(getFilterOptions(res.data));
          }
        });
    }
  }, []);

  const handleShowModal = (type: any, lectureDoc: any) => {
    setSelectedItem(lectureDoc);
    setShowModal(type);
  };
  const handleCloseModal = () => {
    setShowModal(null);
  };

  const handleOnDelete = () => {
    setLoading(true);
    console.log("Document deleted successfull");
    lectureService
      .deleteLecture(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempLectureData = [...lectureData].filter(
          (lecture: any) => lecture.id !== selectedItem.id
        );
        setLectureData(tempLectureData);
        setLoading(false);
        setShowModal(false);
        toast.success("Lecture Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted lecture ${selectedItem.name}`,
          actionType: "lecture",
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

  const handleOnCreate = (createData: any) => {
    setLoading(true);
    const courseID = createData.course.value.id;
    const teacherID =
      userData.role === "Admin" ? createData.teacher.value.id : userData.id;
    const year = createData.year.value;
    const subjectID = createData.subject.value.id;

    const studentPresentIDs = createData.studentsPresent.map(
      (student: any) => student.id
    );
    const studentAbsentIDs = createData.studentsAbsent.map(
      (student: any) => student.id
    );

    const lectureObj = {
      id: uuidv4(),
      courseID: courseID,
      teacherID: teacherID,
      year: year,
      subjectID: subjectID,
      studentPresentIDs: studentPresentIDs,
      studentAbsentIDs: studentAbsentIDs,
      departmentID: userData.departmentID,
      time: new Date().toISOString(),
      creation_date: new Date().toISOString(),
    };
    console.log(lectureObj);
    lectureService
      .createLecture(lectureObj)
      .then((res) => {
        console.log(res);
        if (
          selectedCourseFilter?.value.id === courseID &&
          selectedYearFilter.value === year
        ) {
          setLectureData([lectureObj, ...lectureData]);
        }
        setLoading(false);
        setShowModal(false);
        toast.success("Lecture Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created lecture ${createData.subject.value.name}`,
          actionType: "lecture",
          actionID: lectureObj.id,
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

  const handleOnUpdate = (updateData: any) => {
    setLoading(true);
    const courseID = updateData.course.value.id;
    const teacherID =
      userData.role === "Admin" ? updateData.teacher.value.id : userData.id;
    const year = updateData.year.value;
    const subjectID = updateData.subject.value.id;

    const studentPresentIDs = updateData.studentsPresent.map(
      (student: any) => student.id
    );
    const studentAbsentIDs = updateData.studentsAbsent.map(
      (student: any) => student.id
    );

    const lectureObj = {
      id: selectedItem.id,
      courseID: courseID,
      teacherID: teacherID,
      year: year,
      subjectID: subjectID,
      studentPresentIDs: studentPresentIDs,
      studentAbsentIDs: studentAbsentIDs,
      departmentID: selectedItem.departmentID,
      time: selectedItem.time,
      creation_date: selectedItem.creation_date,
    };
    console.log(lectureObj);
    lectureService
      .updateLecture(lectureObj)
      .then((res) => {
        console.log(res);
        const tempLectureData = [...lectureData].map((lecture: any) => {
          if (lecture.id === selectedItem.id) return lectureObj;
          return lecture;
        });
        setLectureData(tempLectureData);
        setLoading(false);
        setShowModal(false);
        toast.success("Lecture Updated!", {
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

  const filterData = (data: any) => {
    return data.filter(
      (item: any) =>
        (selectedTeacherFilter.label === "All"
          ? true
          : item.teacherID === selectedTeacherFilter.value.id) &&
        (selectedSubjectFilter.label === "All"
          ? true
          : item.subjectID === selectedSubjectFilter.value.id)
    );
  };

  const getSubjectName = (id: any) => {
    console.log(id, subjectFilterOptions);
    const subject: any = subjectFilterOptions.find(
      (subj: any) => subj.value.id === id
    );
    console.log(subject);
    if (subject === undefined) return "";
    return subject.value.name;
    // }
  };

  const getTeacherName = (id: any) => {
    if (id === userData.id) {
      return userData.name;
    }
    const subject: any = teacherFilterOptions.find(
      (subj: any) => subj.value.id === id
    );
    return subject?.value?.name;
  };

  const showTime = (isoTime: any) => {
    return new Date(isoTime).toLocaleString();
  };

  const filterSubjects = (data: any) => {
    console.log(data);
    if (selectedTeacherFilter.length > 1) {
      const filterSubjectOptions = data.filter(
        (subject: any) =>
          subject.value.teacherID === selectedTeacherFilter.value.id
      );
      console.log(selectedTeacherFilter, filterSubjectOptions);
      return filterSubjectOptions;
    }
    return data;
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Lecture Section</h3>
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
              defaultValue={{ label: "Select", value: "select" }}
              onChange={setSelectedCourseFilter}
              options={courseFilterOptions}
              className="filterDropdown"
            />
          </div>
          <div className="filterButton">
            <span>Year : </span>
            <Select
              defaultValue={{ label: "Select", value: "select" }}
              onChange={setSelectedYearFilter}
              options={yearFilterOptions}
              className="filterDropdown"
            />
          </div>
          {userData?.role === "Admin" && (
            <div className="filterButton">
              <span>Teacher : </span>
              <Select
                defaultValue={selectedTeacherFilter}
                onChange={setSelectedTeacherFilter}
                options={teacherFilterOptions}
                className="filterDropdown"
                isDisabled={!selectedCourseFilter || !selectedYearFilter}
              />
            </div>
          )}
          <div className="filterButton">
            <span>Subject : </span>
            <Select
              defaultValue={selectedSubjectFilter}
              onChange={setSelectedSubjectFilter}
              options={filterSubjects(subjectFilterOptions)}
              className="filterDropdown"
              isDisabled={!selectedCourseFilter || !selectedYearFilter}
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
            <th>Subject</th>
            <th>Teacher</th>
            <th>Datetime</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData(lectureData)?.map((lectureDoc: any, index: any) => (
            <tr>
              <td>{index + 1}</td>
              <td>{getSubjectName(lectureDoc.subjectID)}</td>
              <td>{getTeacherName(lectureDoc.teacherID)}</td>
              <td>{showTime(lectureDoc.time)}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  onClick={() => handleShowModal("view", lectureDoc)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("update", lectureDoc)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", lectureDoc)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {showModal === "create" && (
        <CreateLecture
          handleCloseModal={handleCloseModal}
          handleOnCreate={handleOnCreate}
          showModal={true}
          loading={loading}
          subjectFilterOptions={subjectFilterOptions}
          courseFilterOptions={courseFilterOptions}
          teacherFilterOptions={teacherFilterOptions}
        />
      )}
      {showModal === "view" && (
        <UpdateLecture
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={true}
          disabled={true}
          loading={loading}
          subjectFilterOptions={subjectFilterOptions}
          courseFilterOptions={courseFilterOptions}
          teacherFilterOptions={teacherFilterOptions}
        />
      )}
      {showModal === "update" && (
        <UpdateLecture
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          loading={loading}
          subjectFilterOptions={subjectFilterOptions}
          courseFilterOptions={courseFilterOptions}
          teacherFilterOptions={teacherFilterOptions}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="lecture"
          loading={loading}
          subjectName={getSubjectName(selectedItem?.subjectID)}
        />
      )}
    </div>
  );
};

export default Lecture;
