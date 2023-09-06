import React, { useState, useEffect, useContext } from "react";
import "@/css/DashboardServices.css";
import { Button, ButtonGroup, Dropdown, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteAction from "@/components/Actions/DeleteAction";
import Select from "react-select";
import departmentService from "@/services/departmentService";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CreateAction from "../Actions/CreateAction";
import UpdateAction from "../Actions/UpdateAction";
import HeaderContext from "@/context/HeaderContext";
import { departmentFields } from "@/utilities/autoCompleteFields";
import actionLogService from "@/services/actionLogService";
import { sortData } from "@/utilities/usefulFunctions";

const Department = (props) => {
  const { setLoadingModal, userData } = useContext(HeaderContext);
  const [departmentData, setDepartmentData] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoadingModal(true);
    departmentService.getAllDepartments().then((res) => {
      console.log(res.data);
      if (res.data) {
        const data = res.data;
        data.sort(sortData);
        setLoadingModal(false);
        setDepartmentData(data);
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
    departmentService
      .deleteDepartment(selectedItem.id)
      .then((res) => {
        console.log(res);
        const tempDepartmentData = [...departmentData].filter(
          (department) => department.id !== selectedItem.id
        );
        setDepartmentData(tempDepartmentData);
        setLoading(false);
        setShowModal(false);
        toast.success("Department Deleted!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.deleteActionLog({
          id: uuidv4(),
          message: `${userData.name} deleted department ${selectedItem.name}`,
          actionType: "department",
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
    const departmentObj = {
      id: uuidv4(),
      name: createData.name,
      creation_date: new Date().toISOString(),
    };
    departmentService
      .createDepartment(departmentObj)
      .then((res) => {
        console.log(res);
        setDepartmentData([departmentObj, ...departmentData]);
        setLoading(false);
        setShowModal(false);
        toast.success("Department Created!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        actionLogService.createActionLog({
          id: uuidv4(),
          message: `${userData.name} created department ${departmentObj.name}`,
          actionType: "department",
          actionID: departmentObj.id,
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
    const departmentObj = {
      id: selectedItem.id,
      name: updateData.name,
      creation_date: selectedItem.creation_date,
    };
    departmentService
      .updateDepartment(departmentObj)
      .then((res) => {
        console.log(res);
        const tempDepartmentData = [...departmentData].map((department) => {
          if (department.id === selectedItem.id) return departmentObj;
          return department;
        });
        setDepartmentData(tempDepartmentData);
        setLoading(false);
        setShowModal(false);
        toast.success("Department Updated!", {
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

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Department Section</h3>
        <Button
          variant="primary"
          className="createButton"
          onClick={() => handleShowModal("create", null)}
        >
          Create
        </Button>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departmentData?.map((departmentDoc, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{departmentDoc.name}</td>
              <td className="actionsButtons">
                <Button
                  variant="success"
                  className="viewButton"
                  onClick={() => handleShowModal("view", departmentDoc)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  className="updateButton"
                  onClick={() => handleShowModal("update", departmentDoc)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  className="deleteButton"
                  onClick={() => handleShowModal("delete", departmentDoc)}
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
          type="department"
          fields={departmentFields}
          loading={loading}
        />
      )}
      {showModal === "view" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          showModal={showModal}
          type="department"
          fields={departmentFields}
          disabled={true}
        />
      )}
      {showModal === "update" && (
        <UpdateAction
          handleCloseModal={handleCloseModal}
          handleOnUpdate={handleOnUpdate}
          selectedItem={selectedItem}
          showModal={showModal}
          type="department"
          fields={departmentFields}
          loading={loading}
        />
      )}
      {showModal === "delete" && (
        <DeleteAction
          handleCloseModal={handleCloseModal}
          selectedItem={selectedItem}
          handleOnDelete={handleOnDelete}
          showModal={true}
          type="department"
          loading={loading}
        />
      )}
    </div>
  );
};

export default Department;
