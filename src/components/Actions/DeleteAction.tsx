import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";

type Props = {
  showModal: boolean;
  selectedItem: any;
  handleCloseModal: any;
  handleOnDelete: any;
  subjectName?: any;
  type: string;
  loading: boolean;
};

const DeleteAction = ({
  handleCloseModal,
  selectedItem,
  showModal,
  handleOnDelete,
  subjectName,
  type,
  loading,
}: Props) => {
  return (
    <Modal
      show={showModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ color: "#dc3545" }}
        >
          Confirm Delete
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Are you sure you want to delete the {type}{" "}
          {selectedItem.name || subjectName}?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCloseModal} variant="secondary">
          Cancel
        </Button>
        <Button
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
          disabled={loading}
          onClick={handleOnDelete}
          variant="danger"
        >
          Delete{" "}
          {loading && (
            <Spinner
              animation="border"
              variant="light"
              style={{ height: "20px", width: "20px" }}
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteAction;
