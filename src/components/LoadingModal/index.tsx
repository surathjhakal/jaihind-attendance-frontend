import HeaderContext from "@/context/HeaderContext";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import "@/css/LoadingModal.css";

type Props = {};

const quotes = [
  "“Don't let yesterday take up too much of today.” ~ Will Rogers",
  "“If you're going through hell, keep going.” ~ Winston Churchill",
  "“Life shrinks or expands in proportion to one's courage.” ~ Anais Nin",
  "“We need much less than we think we need.” ~ Maya Angelou",
  "“Everything has beauty, but not everyone sees it.” ~ Confucius",
  "“Be yourself; everyone else is already taken.” ~ Oscar Wilde",
  "“Whatever you are, be a good one.” ~ Abraham Lincoln",
  "“Simplicity is the ultimate sophistication.” ~ Leonardo da Vinci",
  "“If you tell the truth you don't have to remember anything.” ~ Mark Twain",
  "“There is no substitute for hard work.” ~ Thomas Edison",
];

const LoadingModal = () => {
  const { loadingModal, loadingMessage }: any = useContext(HeaderContext);
  console.log(loadingModal);
  return (
    <Modal
      show={loadingModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="loadingModal">
        <p>
          {loadingMessage || quotes[Math.floor(Math.random() * quotes.length)]}
        </p>
        <div className="loadingModalCircles">
          <div className="loadingModalCircle"></div>
          <div className="loadingModalCircle"></div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
