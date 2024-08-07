import axios from "axios";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { API_URL } from "../../Config/URL";
import { MdDeleteOutline } from "react-icons/md";

function DeleteAttach({ onSuccess, id }) {
  const [show, setShow] = useState(false);
  const role = sessionStorage.getItem("role");
  // const attachmentId = attachment.id;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handelDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}deleteCompanyProposalAttachment/${id}`
      );
      if (response.status === 201) {
        onSuccess();
        handleClose();
        toast.success(response.data.message);
      } else if (response.status === 200) {
        onSuccess();
        handleClose();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error deleting data:", error);
    }
  };

  return (
    <>
      <button disabled={role === "CMP_USER"} className="btn btn-sm text-danger" onClick={handleShow}>
        <MdDeleteOutline />
      </button>

      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <b>Delete</b>
          </Modal.Title>
        </Modal.Header>
        <hr style={{ margin: "0px" }} />
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <hr style={{ margin: "0px" }} />

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handelDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteAttach;
