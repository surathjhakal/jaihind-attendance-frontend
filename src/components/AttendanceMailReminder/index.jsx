import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import HeaderContext from "@/context/HeaderContext";
import {
  defaultFilter,
  selectDefaultFilter,
} from "@/utilities/autoCompleteFields";
import courseService from "@/services/courseService";
import {
  getFilterOptions,
  yearFilterOptions,
} from "@/utilities/autoCompleteOptions";
import { toast } from "react-toastify";
import subjectService from "@/services/subjectService";
import Select from "react-select";
import { Button } from "react-bootstrap";
import studentService from "@/services/studentService";
import {
  getAllSubjectsExportData,
  getSubjectExportData,
} from "@/utilities/exportToExcel";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import adminService from "@/services/adminService";
import { getSem } from "@/utilities/usefulFunctions";

const AttendanceMailReminder = () => {
  const { userData, setLoadingModal, setLoadingMessage } =
    useContext(HeaderContext);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState(null);
  const [courseFilterOptions, setCourseFilterOptions] = useState([]);

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState(null);
  const [subjectFilterOptions, setSubjectFilterOptions] = useState([]);

  const [selectedYearFilter, setSelectedYearFilter] = useState(null);

  useEffect(() => {
    courseService
      .getAllCourses({ filter: { departmentID: userData.departmentID } })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setCourseFilterOptions(getFilterOptions(res.data));
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server Error", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });

    subjectService
      .getAllSubjects({ filter: { departmentID: userData.departmentID } })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setSubjectFilterOptions(getFilterOptions(res.data));
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
    if (selectedCourseFilter && selectedYearFilter) {
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
            setSubjectFilterOptions(getFilterOptions(res.data));
          }
        });
    }
  }, [selectedCourseFilter, selectedYearFilter]);

  const handleOnMail = () => {
    setLoadingModal(true);
    setLoadingMessage("Please wait! Sending Mail to Students");
    const sem = getSem(selectedYearFilter);
    adminService
      .sendMailReminder({
        departmentID: userData.departmentID,
        year: selectedYearFilter.value,
        courseID: selectedCourseFilter.value?.id,
        subjectName: selectedSubjectFilter.value?.name,
        sem: sem,
        subjectID: selectedSubjectFilter.value?.id,
      })
      .then((res) => {
        console.log(res);
        setLoadingModal(false);
        setLoadingMessage(null);
        toast.success("Successfully sent mail to students!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      })
      .catch((err) => {
        setLoadingModal(false);
        setLoadingMessage(null);

        console.log(err);
        toast.error("Error Occured !", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Send Mail Reminder to Students</h3>
      </div>
      <div className="partitionLine"></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div className="filterButton" style={{ gap: "1rem" }}>
          <span>Course : </span>
          <Select
            defaultValue={selectDefaultFilter}
            onChange={setSelectedCourseFilter}
            options={courseFilterOptions}
            className="filterDropdown"
          />
        </div>
        <div className="filterButton" style={{ gap: "1rem" }}>
          <span>Year : </span>
          <Select
            defaultValue={selectDefaultFilter}
            onChange={setSelectedYearFilter}
            options={yearFilterOptions}
            className="filterDropdown"
            isDisabled={!selectedCourseFilter}
          />
        </div>
        <div className="filterButton" style={{ gap: "1rem" }}>
          <span>Subjects : </span>
          <Select
            defaultValue={selectDefaultFilter}
            onChange={setSelectedSubjectFilter}
            options={subjectFilterOptions}
            className="filterDropdown"
            isDisabled={!selectedCourseFilter || !selectedYearFilter}
          />
        </div>
        <Button
          disabled={
            !selectedCourseFilter ||
            !selectedYearFilter ||
            !selectedSubjectFilter
          }
          variant="primary"
          style={{ width: "250px", padding: "0.5rem" }}
          onClick={handleOnMail}
        >
          Send Mail
        </Button>
      </div>
    </div>
  );
};

export default AttendanceMailReminder;
