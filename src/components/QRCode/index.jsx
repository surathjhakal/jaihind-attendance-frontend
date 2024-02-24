import React, { useEffect, useRef, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import QRCodeImage from "qrcode.react";

const QRCode = ({ handleCloseModal, qrList, final_expire }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const intervalRef = useRef(null);

  console.log(qrList);
  console.log(final_expire);

  useEffect(() => {
    if (qrList?.length) {
      // Use useRef to avoid race conditions
      intervalRef.current = setInterval(() => {
        // Safely update currentIndex within the interval callback
        if (currentIndex + 1 < qrList.length) {
          setSelectedUrl(qrList[currentIndex + 1]); // Assuming setSelectedUrl exists
          setCurrentIndex(currentIndex + 1);
        } else {
          handleCloseModal();
        }
      }, 5000); // Change interval if needed
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [qrList, currentIndex]);

  useEffect(() => {
    if (final_expire) {
      setTimeRemaining(306);
    }
  }, [final_expire]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const intervalId = setInterval(() => {
        // Timer action here (e.g., alert, update state)
        setTimeRemaining(timeRemaining - 1);
        console.log("Timer finished!");
      }, 1000);

      return () => clearInterval(intervalId); // Clear interval on unmount
    }
  }, [timeRemaining]);

  function getRemainingSeconds(date1Str, date2Str) {
    console.log("hello");
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    const diff = date2.getTime() - date1.getTime();
    return Math.abs(Math.round(diff / 1000));
  }

  const secondsLeft = getRemainingSeconds(
    final_expire,
    new Date().toISOString()
  );
  console.log(`There are ${secondsLeft} seconds remaining.`);

  return (
    <Modal
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          OR Code Scan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {selectedUrl ? (
          <QRCodeImage
            value={selectedUrl}
            size={300}
            fgColor="#000000"
            bgColor="#FFFFFF"
          />
        ) : (
          <Spinner
            animation="border"
            variant="primary"
            style={{ height: "20px", width: "20px" }}
          />
        )}
        {final_expire && <p>QR Code expires in: {timeRemaining} secs left</p>}
      </Modal.Body>
    </Modal>
  );
};

export default QRCode;
