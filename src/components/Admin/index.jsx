import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import { adminFields, defaultFilter } from "@/utilities/autoCompleteFields";
import adminService from "@/services/adminService";
import departmentService from "@/services/departmentService";
import { getFilterOptions } from "@/utilities/autoCompleteOptions";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import HeaderContext from "@/context/HeaderContext";
import actionLogService from "@/services/actionLogService";
import { sortData } from "@/utilities/usefulFunctions";

const Admin = () => {
  const { userData, setLoadingModal } = useContext(HeaderContext);
  const [adminData, setAdminData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] =
    useState(defaultFilter);
  const [departmentFilterOptions, setDepartmentFilterOptions] = useState([
    defaultFilter,
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadingModal(true);
    adminService.getAllAdmin().then((res) => {
      console.log(res.data);
      if (res.data) {
        const data = res.data;
        data.sort(sortData);
        setLoadingModal(false);
        setAdminData(data);
      }
    });
    departmentService.getAllDepartments().then((res) => {
      console.log(res.data);
      if (res.data) {
        const data = res.data;
        data.sort(sortData);
        const departmentOptions = getFilterOptions(data);
        setDepartmentFilterOptions([defaultFilter, ...departmentOptions]);
      }
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
    adminService
      .deleteAdmin(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempAdminData = [...adminData].filter(
          (admin) => admin.id !== selectedItem.id
        );
        setAdminData(tempAdminData);
        setLoading(false);
        setShowModal(false);
        toast.success("Admin Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted admin ${selectedItem.name}`,
          actionType: "admin",
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
    const adminObj = {
      id: uuidv4(),
      name: createData.name,
      email: createData.email,
      password: createData.password,
      departmentID: userData.departmentID,
      creation_date: new Date().toISOString(),
    };
    adminService
      .createAdmin(adminObj)
      .then((res) => {
        console.log(res);
        setAdminData([adminObj, ...adminData]);
        setLoading(false);
        setShowModal(false);
        toast.success("Admin Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created admin ${adminObj.name}`,
          actionType: "admin",
          actionID: adminObj.id,
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
    setLoading(true);
    const adminObj = {
      id: selectedItem.id,
      name: updateData.name,
      email: updateData.email,
      password: updateData.password,
      departmentID: selectedItem.departmentID,
      creation_date: selectedItem.creation_date,
    };
    adminService
      .updateAdmin(adminObj)
      .then((res) => {
        console.log(res);
        const tempAdminData = [...adminData].map((admin) => {
          if (admin.id === selectedItem.id) return adminObj;
          return admin;
        });
        setAdminData(tempAdminData);
        setLoading(false);
        setShowModal(false);
        toast.success("Admin Updated!", {
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
    return data.filter((item) =>
      selectedDepartmentFilter.label === "All"
        ? true
        : item.departmentID === selectedDepartmentFilter.value.id
    );
  };

  const getDepartmentName = (id) => {
    const department = departmentFilterOptions.find(
      (department) => department.value.id === id
    );
    if (department !== -1 && department) return department?.value?.name;
    return "";
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Admin Section</h3>
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
            <span>Department : </span>
            <Select
              defaultValue={selectedDepartmentFilter}
              onChange={setSelectedDepartmentFilter}
              options={departmentFilterOptions}
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
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterData(adminData)?.map((adminDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{adminDoc.name}</td>
              <td>{adminDoc.email}</td>
              <td>{getDepartmentName(adminDoc.departmentID)}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  onClick={() => handleShowModal("view", adminDoc)}
                  className="viewButton"
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal("update", adminDoc)}
                  className="updateButton"
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowModal("delete", adminDoc)}
                  className="deleteButton"
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
          type="admin"
          fields={adminFields}
          loading={loading}
          departmentsData={departmentFilterOptions}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="admin"
          fields={adminFields}
          disabled={true}
          departmentsData={departmentFilterOptions}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="admin"
          fields={adminFields}
          loading={loading}
          departmentsData={departmentFilterOptions}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="admin"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Admin;
