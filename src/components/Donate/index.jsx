import HeaderContext from "@/context/HeaderContext";
import donationService from "@/services/donationService";
import React, { useState, useEffect, useContext } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Donate = () => {
  const { setLoadingModal } = useContext(HeaderContext);
  const [donatedUsers, setDonatedUsers] = useState([
    { name: "Surath Jhakal", price: 5 },
  ]);
  const [name, setName] = useState("");
  const typesOfCoffee = [
    "Cheap Coffee- 2₹",
    "Good Coffee- 5₹",
    "Best Coffee- 10₹",
  ];

  useEffect(() => {
    setLoadingModal(true);
    donationService
      .getAllDonations()
      .then((res) => {
        setLoadingModal(false);
        if (res.data?.length > 0) {
          setDonatedUsers(res.data);
        } else {
          setDonatedUsers([]);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoadingModal(false);
      });
  }, []);

  const getCoffeeName = (price) => {
    if (price == 10) return "Best";
    else if (price == 5) return "Good";
    else return "Cheap";
  };

  const handleOnDonate = (coffee) => {
    if (name.trim() === "") {
      toast.error("Please enter your name !", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    const obj = {
      name: name,
      price: 0,
      id: Math.floor(Math.random() * Date.now()),
    };
    if (coffee.includes("Best")) {
      obj.price = 10;
    } else if (coffee.includes("Good")) {
      obj.price = 5;
    } else {
      obj.price = 2;
    }
    donationService
      .buyCoffee(obj)
      .then((response) => {
        console.log(response);
        window.location.href = response.data.url;
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="dashboardServicesContainer">
      <div className="dashboardHeadingSection1">
        <h3 className="dashboardHeading">Buy me a coffee 😄</h3>
      </div>
      <div className="partitionLine"></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        {typesOfCoffee.map((coffee, index) => (
          <div
            style={{
              padding: "1rem",
              borderRadius: "4px",
              background: "#f49b1d",
              color: "black",
              width: "150px",
              cursor: "pointer",
            }}
            key={index}
            onClick={() => handleOnDonate(coffee)}
          >
            {coffee}
          </div>
        ))}
      </div>
      <div>
        <h4>List of People who bought me a coffee</h4>
        {donatedUsers.map((user, index) => (
          <h4 key={index}>
            {user.name} bought me {getCoffeeName(user.price)} coffee at{" "}
            {user.price}₹
          </h4>
        ))}
      </div>
    </div>
  );
};

export default Donate;
