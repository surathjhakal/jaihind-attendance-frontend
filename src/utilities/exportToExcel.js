import { getExcelAttendanceData } from "./studentAttendance";

export const getSubjectExportData = (studentsData, attendanceData) => {
  let data = [];
  studentsData.forEach((student) => {
    const row = {};
    row["00-UID"] = student.uid;
    row["00-Name"] = student.name;
    let presentCount = 0,
      totalCount = 0;
    attendanceData.lectures.forEach((lecture) => {
      const date = new Date(lecture.time).toLocaleDateString("en-GB");

      if (lecture.studentPresentIDs.includes(student.id)) {
        row[[date]] = "Present";
        presentCount += 1;
      } else {
        row[[date]] = "Absent";
      }
      totalCount += 1;
    });
    const per = Math.round((presentCount / totalCount) * 100).toFixed(2);
    row["Total"] = `(${presentCount}/${totalCount})=${per}%`;
    data.push(row);
  });
  return data;
};

export const getAllSubjectsExportData = (studentsData, attendanceData) => {
  let data = [];
  studentsData.forEach((student) => {
    const row = {};
    row["00-UID"] = student.uid;
    row["00-Name"] = student.name;
    let pC = 0,
      tC = 0;
    attendanceData.forEach((attObj) => {
      const { presentCount, totalCount, percentage } = getExcelAttendanceData(
        attObj.lectures,
        student.id
      );
      row[
        [attObj.subject.name]
      ] = `(${presentCount}/${totalCount})=${percentage}%`;
      pC += presentCount;
      tC += totalCount;
    });
    const per = Math.round((pC / tC) * 100).toFixed(2);
    row.Total = `(${pC}/${tC})=${per}%`;
    data.push(row);
  });
  return data;
};
