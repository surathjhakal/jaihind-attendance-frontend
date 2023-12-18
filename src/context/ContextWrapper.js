import { useState } from "react";
import HeaderContext from "./HeaderContext";

const ContextWrapper = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [coursesData, setCoursesData] = useState(null);
  const [teachersData, setTeachersData] = useState(null);
  const [departmentsData, setDepartmentsData] = useState(null);
  const [subjectsData, setSubjectsData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  return (
    <HeaderContext.Provider
      value={{
        userData,
        setUserData,
        loadingModal,
        setLoadingModal,
        loadingMessage,
        setLoadingMessage,
        coursesData,
        setCoursesData,
        teachersData,
        setTeachersData,
        departmentsData,
        setDepartmentsData,
        subjectsData,
        setSubjectsData,
        profilePhoto,
        setProfilePhoto,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default ContextWrapper;
