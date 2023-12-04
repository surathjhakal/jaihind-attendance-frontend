import HeaderContext from "@/context/HeaderContext";
import actionLogService from "@/services/actionLogService";
import { formatDate, sortData } from "@/utilities/usefulFunctions";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

type Props = {};

const Activity = (props: Props) => {
  const { userData, setLoadingModal }: any = useContext(HeaderContext);
  const [actionLogsData, setActionLogsData] = useState([]);
  useEffect(() => {
    setLoadingModal(true);
    if (userData.role === "Admin") {
      actionLogService
        .getAllActionLogs({
          filter: {
            departmentID: userData.departmentID,
          },
        })
        .then((res) => {
          console.log(res.data);
          const data = res.data;
          data.sort(sortData);
          setActionLogsData(data);
          setLoadingModal(false);
        });
    } else {
      actionLogService
        .getAllActionLogs({
          filter: {
            departmentID: userData.departmentID,
            userID: userData.id,
          },
        })
        .then((res) => {
          console.log(res.data);
          const data = res.data;
          data.sort(sortData);
          setActionLogsData(data);
          setLoadingModal(false);
        });
    }
  }, []);

  const getVariant = (log: any) => {
    return log.message.includes("created") ? "success" : "danger";
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Activity Log Section</h3>
      </div>
      <div className="partitionLine"></div>
      <div className="activityLogsList">
        {actionLogsData.map((log: any, index) => (
          <Alert
            key={index}
            variant={getVariant(log)}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {log.message} <span>{formatDate(log.creation_date)}</span>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default Activity;
