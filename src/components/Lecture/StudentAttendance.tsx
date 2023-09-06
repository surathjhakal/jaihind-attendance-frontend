import ShowStudent from "./ShowStudent";
import "@/css/Lecture.css";

type Props = {};

const StudentAttendance = ({
  studentsPresent,
  studentsAbsent,
  allStudents,
  setAllStudents,
  handleOnChangeStudentsStatus,
  isDisabled,
  studentsLoading,
}: any) => {
  const onPresentStudentCancel = (student: any) => {
    setAllStudents([...allStudents, student]);
    handleOnChangeStudentsStatus("remove", "present", student);
  };

  const onAbsentStudentCancel = (student: any) => {
    setAllStudents([...allStudents, student]);
    handleOnChangeStudentsStatus("remove", "absent", student);
  };

  const onStudentCancel = (student: any) => {
    setAllStudents([
      ...allStudents.filter((stud: any) => stud.id !== student.id),
    ]);
    handleOnChangeStudentsStatus("add", "absent", student);
  };

  const onStudentPresent = (student: any) => {
    setAllStudents([
      ...allStudents.filter((stud: any) => stud.id !== student.id),
    ]);
    handleOnChangeStudentsStatus("add", "present", student);
  };

  return (
    <div className="studentAttendance">
      <h1>Students</h1>
      <div className="studentAttendanceSection">
        <div className="studentAttendanceSection1">
          {/* Present Students */}
          <ShowStudent
            title="Present Students"
            data={studentsPresent}
            disableButtons={{ select: true }}
            onCancel={onPresentStudentCancel}
            color="green"
            isDisabled={isDisabled}
            studentsLoading={studentsLoading}
          />
          {/* Absent Students */}
          <ShowStudent
            title="Absent Students"
            data={studentsAbsent}
            disableButtons={{ select: true }}
            onCancel={onAbsentStudentCancel}
            color="red"
            isDisabled={isDisabled}
            studentsLoading={studentsLoading}
          />
        </div>
        {/* All Students */}
        {!isDisabled && (
          <ShowStudent
            title="All Students"
            data={allStudents}
            onCancel={onStudentCancel}
            onSelect={onStudentPresent}
            color="orange"
            isDisabled={isDisabled}
            studentsLoading={studentsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
