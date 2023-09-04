import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "@/css/Header.css";
import { FiLogOut } from "react-icons/fi";
import adminService from "@/services/adminService";
import { useContext } from "react";
import HeaderContext from "@/context/HeaderContext";
import teacherService from "@/services/teacherService";

type Props = {
  userData: object;
};

const Header = () => {
  const { userData, setUserData, profilePhoto }: any =
    useContext(HeaderContext);
  const handleOnLogout = () => {
    if (userData.role === "Admin") {
      adminService.adminLogout(userData.id);
      setUserData(null);
    } else {
      teacherService.teacherLogout(userData.id);
      setUserData(null);
    }
  };
  return (
    <Navbar
      sticky="top"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container>
        <Link to="/" className="headerLink">
          <Navbar.Brand className="headerName">
            <img
              alt=""
              src="/jaihind-logo.jpg"
              className="d-inline-block align-top headerLogo"
            />{" "}
            Jaihind College
          </Navbar.Brand>
        </Link>
        {userData && (
          <Nav className="ml-auto headerNavLink">
            <Link to="/profile">
              <img
                src={
                  profilePhoto ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt=""
                className="headerProfile"
              />
            </Link>
            <FiLogOut className="headerLogout" onClick={handleOnLogout} />
          </Nav>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
