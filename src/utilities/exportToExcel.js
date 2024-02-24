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
      let date = new Date(lecture.time);
      date = date.toLocaleDateString() + "-" + date.toLocaleTimeString();

      if (lecture.studentPresentIDs.includes(student.id)) {
        row[[date]] = "Present";
        totalCount++;
        presentCount++;
      } else if (lecture.studentAbsentIDs.includes(student.id)) {
        row[[date]] = "Absent";
        totalCount++;
      } else {
        row[[date]] = "NAN";
      }
    });
    const per = Math.round((presentCount / totalCount) * 100).toFixed(2);
    row["Total"] = `(${presentCount}/${totalCount})=${per}%`;
    row.mark = per >= 75 ? true : false;
    data.push(row);
  });
  return data;
};

export const getAllSubjectsExportData = (studentsData, attendanceData) => {
  console.log(attendanceData);
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
    row.mark = per >= 75 ? true : false;
    data.push(row);
  });
  return data;
};
