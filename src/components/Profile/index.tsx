import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../../css/Profile.css";
import HeaderContext from "../../context/HeaderContext";
import { Button } from "react-bootstrap";
import adminService from "../../services/adminService";
import teacherService from "../../services/teacherService";
import departmentService from "../../services/departmentService";
import fileService from "../../services/fileService";

const Profile = () => {
  const {
    userData,
    setUserData,
    setLoadingModal,
    profilePhoto,
    setProfilePhoto,
    loadingModal,
  }: any = useContext(HeaderContext);
  const [userChanges, setUserChanges] = useState(userData);
  const [changeProfilePhoto, setChangeProfilePhoto]: any = useState(null);
  const [adminName, setAdminName]: any = useState("");
  const [departmentName, setDepartmentName]: any = useState("");
  const [tempProfilePhoto, setTempProfilePhoto] = useState(profilePhoto);

  const handleChanges = (type: any, value: any) => {
    setUserChanges({ ...userChanges, [type]: value });
  };

  useEffect(() => {
    if (userData.adminID) {
      adminService.getAdmin(userData.adminID).then((res) => {
        console.log(res);
        setAdminName(res.data.name);
      });
    }
    if (userData.departmentID) {
      departmentService.getDepartment(userData.departmentID).then((res) => {
        console.log(res);
        setDepartmentName(res.data.name);
      });
    }
  }, []);

  const formatFileName = (fileName: any) => {
    console.log(fileName);
    if (!fileName) return null;
    let tempFileName = fileName.toLowerCase().trim().split(" ").join("-");
    tempFileName = tempFileName.split(".");
    tempFileName = tempFileName[0] + "-" + userData.id + "." + tempFileName[1];
    return tempFileName;
  };

  const onSaveProfileData = async () => {
    console.log(userChanges);
    if (userChanges.name === "")
      return toast.error("you can't give empty name");
    setLoadingModal(true);
    let updatedUserData = userChanges;
    if (
      !updatedUserData.creation_date ||
      updatedUserData.creation_date === undefined
    )
      updatedUserData.creation_date = new Date().toISOString();
    console.log(userData.profilePhoto);
    if (changeProfilePhoto.name !== userData.profilePhoto && profilePhoto) {
      fileService
        .deleteProfilePhoto(userChanges.profilePhoto)
        .then((res) => {
          console.log("file deleted", res);
        })
        .catch((err) => {
          console.log(err);
          setLoadingModal(false);
          toast.error("Error in file delete", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    }
    if (changeProfilePhoto && changeProfilePhoto !== "") {
      updatedUserData.profilePhoto = formatFileName(changeProfilePhoto?.name);
      const formData = new FormData();
      formData.append("file", changeProfilePhoto);
      await fileService.uploadProfilePhoto(formData).catch((err) => {
        console.log(err);
        setLoadingModal(false);
        toast.error("Error in file upload", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      });
    }
    if (userData.role === "Admin") {
      adminService
        .updateAdmin(updatedUserData)
        .then((res) => {
          console.log(res);
          if (res) {
            setProfilePhoto(tempProfilePhoto);
            setUserData(updatedUserData);
            setUserChanges(updatedUserData);
            setChangeProfilePhoto("");
            toast.success("Updated profile data", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingModal(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingModal(false);
          toast.error("Error Occured", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    } else {
      teacherService
        .updateTeacher(updatedUserData)
        .then((res) => {
          console.log(res);
          if (res) {
            setProfilePhoto(tempProfilePhoto);
            setUserData(updatedUserData);
            setUserChanges(updatedUserData);
            setChangeProfilePhoto("");
            toast.success("Updated profile data", {
              position: toast.POSITION.BOTTOM_RIGHT,
            });
            setLoadingModal(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingModal(false);
          toast.error("Error Occured", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        });
    }
  };

  const handleChangeProfilePhoto = (e: any) => {
    const file = e.target.files[0];
    console.log(file);
    if (
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
    ) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // e.target.result contains the data URL of the selected image
        setTempProfilePhoto(e.target.result);
      };

      reader.readAsDataURL(file);
      setChangeProfilePhoto(file);
    } else {
      toast.error("Only jpeg,png,jpg is allowed!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setChangeProfilePhoto("");
    }
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Profile Page</h3>
      </div>
      <div className="partitionLine" style={{ margin: "1rem 0" }}></div>
      <div className="profilePage">
        <div className="profilePage_header">
          <img
            src={
              tempProfilePhoto ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="profilePage_image"
          />
          <input
            type="file"
            onChange={handleChangeProfilePhoto}
            value={changeProfilePhoto?.originalname}
            placeholder="kudsbhfu"
          />
        </div>
        <div className="profilePage_info">
          <div className="profilePage_content">
            <p>Name</p>
            <input
              type="text"
              name="user_firstName"
              placeholder="Enter your Name"
              value={userChanges.name}
              onChange={(e) => handleChanges("name", e.target.value)}
            />
          </div>
          <div className="profilePage_content">
            <p>Email Address</p>
            <input
              type="text"
              placeholder="Enter your email"
              disabled
              value={userChanges.email}
            />
          </div>
          <div className="profilePage_content">
            <p>Phone Number</p>
            <input
              type="number"
              placeholder="Enter your phone no."
              value={userChanges.phoneNo}
              onChange={(e) => handleChanges("phoneNo", e.target.value)}
            />
          </div>
          <div className="profilePage_content">
            <p>Location</p>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              name="user_location"
              value={userChanges.location}
              onChange={(e) => handleChanges("location", e.target.value)}
            />
          </div>
          {userData.role !== "Admin" && (
            <div className="profilePage_content">
              <p>Admin</p>
              <input type="text" name="user_admin" disabled value={adminName} />
            </div>
          )}
          <div className="profilePage_content">
            <p>Department</p>
            <input
              type="text"
              name="user_admin"
              disabled
              value={departmentName}
            />
          </div>
        </div>
        <Button
          variant="success"
          className="profile_save"
          onClick={onSaveProfileData}
          disabled={loadingModal}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Profile;
