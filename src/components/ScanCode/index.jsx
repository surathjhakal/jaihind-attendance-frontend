import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { toast } from "react-toastify";

const ScanCode = ({ handleCloseModal, handleScanData }) => {
  const [scanSuccessful, setScanSuccessful] = useState(false);
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader", {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    });
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      if (!scanSuccessful) {
        html5QrCode.stop();
        setScanSuccessful(true);
        handleScanData(decodedText);
      }
    };
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      qrCodeSuccessCallback
    );
  }, []);

  return (
    <Modal
      show={true}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          QR Code Scan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
          height: "400px",
          margin: "1rem 0",
          overflow: "hidden",
        }}
      >
        <div id="reader" style={{ height: "250px", width: "250px" }}></div>
      </Modal.Body>
    </Modal>
  );
};

export default ScanCode;
