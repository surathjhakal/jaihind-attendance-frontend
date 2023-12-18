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

const ExportToExcel = () => {
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

  const handleOnExport = () => {
    setLoadingModal(true);
    setLoadingMessage("Please wait! Exporting it to excel");
    studentService
      .getAllStudent({
        filter: {
          departmentID: userData.departmentID,
          courseID: selectedCourseFilter.value?.id,
          year: selectedYearFilter.value,
        },
      })
      .then((studentsRes) => {
        let sem;
        const currentMonth = new Date().getMonth() + 1;
        if ([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12].includes(currentMonth)) {
          if (selectedYearFilter.value === 1) sem = 1;
          else if (selectedYearFilter.value === 2) sem = 3;
          else sem = 5;
        } else {
          if (selectedYearFilter.value === 1) sem = 2;
          else if (selectedYearFilter.value === 2) sem = 4;
          else sem = 6;
        }
        sem = sem + "";
        studentService
          .getAttendance({
            courseID: selectedCourseFilter.value?.id,
            sem: sem,
            subjectID: selectedSubjectFilter?.value?.id,
          })
          .then((attendanceRes) => {
            let excelData = [];
            let fileName = "";
            if (selectedSubjectFilter?.value?.id) {
              excelData = getSubjectExportData(
                studentsRes.data,
                attendanceRes.data
              );
              fileName = `Export-${attendanceRes.data.subject.name}-${selectedCourseFilter.value.name}-${selectedYearFilter.value}year`;
            } else {
              excelData = getAllSubjectsExportData(
                studentsRes.data,
                attendanceRes.data
              );
              fileName = `Export-All-${selectedCourseFilter.value.name}-${selectedYearFilter.value}year`;
            }
            console.log("excelData", excelData);
            const fileType =
              "application/vdn.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";

            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, {
              bookType: "xlsx",
              type: "array",
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName + fileExtension);
            setLoadingModal(false);
            setLoadingMessage(null);
            toast.success("Successfully exported to excel!", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          })
          .catch((err) => {
            setLoadingModal(false);
            setLoadingMessage(null);

            console.log(err);
            toast.error("Error Exporting !", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
          });
      });
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Export To Excel Section</h3>
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
            defaultValue={defaultFilter}
            onChange={setSelectedSubjectFilter}
            options={[defaultFilter, ...subjectFilterOptions]}
            className="filterDropdown"
            isDisabled={!selectedCourseFilter || !selectedYearFilter}
          />
        </div>
        <Button
          disabled={!selectedCourseFilter || !selectedYearFilter}
          variant="primary"
          style={{ width: "250px", padding: "0.5rem" }}
          onClick={handleOnExport}
        >
          Export
        </Button>
      </div>
    </div>
  );
};

export default ExportToExcel;
