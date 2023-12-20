import http from "../utilities/http-axios";

const buyCoffee = (data) => {
  return http.post("/donation/buy-coffee", data);
};

const addUserDonation = (data) => {
  return http.post("/donation/add-user-donation", data);
};

const getAllDonations = () => {
  return http.get("/donation/get-all-donations");
};

const donationService = {
  buyCoffee,
  addUserDonation,
  getAllDonations,
};

export default donationService;
