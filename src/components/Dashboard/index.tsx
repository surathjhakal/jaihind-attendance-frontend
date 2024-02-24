import HeaderContext from "@/context/HeaderContext";
import React, { useContext, useState } from "react";
import "@/css/Dashboard.css";
import { Link } from "react-router-dom";
import { GiHand } from "react-icons/gi";
import { BiSolidDashboard } from "react-icons/bi";
import { MdAdminPanelSettings, MdCoPresent, MdTopic } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { PiStudentBold } from "react-icons/pi";
import { SiCoursera } from "react-icons/si";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FcDepartment } from "react-icons/fc";
import { RxActivityLog } from "react-icons/rx";
import { formatTodayDate } from "@/utilities/usefulFunctions";
import { MdOutgoingMail } from "react-icons/md";

type Props = {};

const Dashboard = (props: Props) => {
  const { userData, setUserData }: any = useContext(HeaderContext);
  return (
    <div className="dashboard">
      <h4 className="dashboardDate">{formatTodayDate()}</h4>
      <h1 className="dashboardUserName">
        Hello, {userData.name} <GiHand className="dashboardHand" />
      </h1>
      <div className="partitionLine"></div>
      <h3 className="dashboardHeading">
        Dashboard Services <BiSolidDashboard />{" "}
      </h3>
      <div className="partitionLine"></div>
      <div className="dashboardServices">
        {userData.role === "Admin" ? (
          <>
            <Link to="admin">
              <div className="dashboardBox">
                Admin <MdAdminPanelSettings />
              </div>
            </Link>
            <Link to="student">
              <div className="dashboardBox">
                Students <PiStudentBold />
              </div>
            </Link>
            <Link to="course">
              <div className="dashboardBox">
                Courses <SiCoursera />
              </div>
            </Link>
            <Link to="lecture">
              <div className="dashboardBox">
                Lectures <MdCoPresent />
              </div>
            </Link>
            <Link to="subject">
              <div className="dashboardBox">
                Subjects <MdTopic />
              </div>
            </Link>
            <Link to="teacher">
              <div className="dashboardBox">
                Teachers <FaChalkboardTeacher />
              </div>
            </Link>
            <Link to="department">
              <div className="dashboardBox">
                Department <FcDepartment />
              </div>
            </Link>
            <Link to="activity">
              <div className="dashboardBox">
                Activity Logs
                <RxActivityLog />
              </div>
            </Link>
            <Link to="export">
              <div className="dashboardBox">
                Export to Excel
                <SiMicrosoftexcel />
              </div>
            </Link>
            <Link to="attendance-mail-reminder">
              <div className="dashboardBox">
                Send Mail Reminder
                <MdOutgoingMail />
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link to="lecture">
              <div className="dashboardBox">
                Lectures <MdCoPresent />
              </div>
            </Link>
            <Link to="subject">
              <div className="dashboardBox">
                Assigned Subjects <MdTopic />
              </div>
            </Link>
            <Link to="student">
              <div className="dashboardBox">
                Students <PiStudentBold />
              </div>
            </Link>
            <Link to="course">
              <div className="dashboardBox">
                Courses <SiCoursera />
              </div>
            </Link>
            <Link to="activity">
              <div className="dashboardBox">
                Activity Logs
                <RxActivityLog />
              </div>
            </Link>
            <Link to="export">
              <div className="dashboardBox">
                Export to Excel
                <SiMicrosoftexcel />
              </div>
            </Link>
            <Link to="attendance-mail-reminder">
              <div className="dashboardBox">
                Send Mail Reminder
                <MdOutgoingMail />
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
