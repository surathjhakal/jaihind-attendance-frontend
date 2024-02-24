export const checkPresentStatus = (presentStudents, studentID) => {
  if (presentStudents.includes(studentID)) {
    return <td className="studentPresent">Present</td>;
  }
  return <td className="studentAbsent">Absent</td>;
};

export const getSubjectAttendancePresent = (lectures, studentID) => {
  const presentCount = lectures.filter((lecture) =>
    lecture.studentPresentIDs.includes(studentID)
  ).length;
  const totalCount = lectures.filter(
    (lecture) =>
      lecture.studentPresentIDs.includes(studentID) ||
      lecture.studentAbsentIDs.includes(studentID)
  ).length;
  const percentage = Math.round((presentCount / totalCount) * 100).toFixed(2);
  let tempPercentage = percentage;
  let count = 0;
  while (tempPercentage < 75) {
    count++;
    tempPercentage = Math.round(
      ((presentCount + count) / (totalCount + count)) * 100
    ).toFixed(2);
  }
  return (
    <>
      <h2
        style={{ fontSize: "1rem", color: count > 0 ? "#d02121" : "#12bc12" }}
      >
        Attendance Percentage ({presentCount}/{totalCount}) - {percentage}%{" "}
      </h2>
      {count > 0 && (
        <h2 style={{ fontSize: "1rem", color: "#e99700" }}>
          Attendance 75% predictor - Need to sit {count} Lecture
        </h2>
      )}
    </>
  );
};

export const getOverallAttendancePrecentage = (attendanceData, studentID) => {
  if (attendanceData.length === 0) return;
  let totalCount = 0;
  let presentCount = 0;
  attendanceData.forEach((item) => {
    presentCount += item.lectures.filter((lecture) =>
      lecture.studentPresentIDs.includes(studentID)
    ).length;
    totalCount += item.lectures.filter(
      (lecture) =>
        lecture.studentPresentIDs.includes(studentID) ||
        lecture.studentAbsentIDs.includes(studentID)
    ).length;
  });
  const percentage = Math.round((presentCount / totalCount) * 100).toFixed(2);
  return (
    <h2
      style={{
        fontSize: "1rem",
        color: percentage < 75 ? "#d02121" : "#12bc12",
      }}
    >
      Overall Attendance Percentage ({presentCount}/{totalCount}) - {percentage}
      %{" "}
    </h2>
  );
};

export const getExcelAttendanceData = (lectures, studentID) => {
  const presentCount = lectures.filter((lecture) =>
    lecture.studentPresentIDs.includes(studentID)
  ).length;
  const totalCount = lectures.filter(
    (lecture) =>
      lecture.studentPresentIDs.includes(studentID) ||
      lecture.studentAbsentIDs.includes(studentID)
  ).length;
  const percentage = Math.round((presentCount / totalCount) * 100).toFixed(2);
  return { presentCount, totalCount, percentage };
};
