import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend, IoIosSend } from "react-icons/io";
import { MdErrorOutline, MdDelete } from "react-icons/md";
import user from "../../assets/user.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";
import { Tooltip, Zoom } from "@mui/material";
import { toast } from "react-toastify";
import { BiMailSend } from "react-icons/bi";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";

const role = sessionStorage.getItem("role");

const validationSchema = yup.object().shape({
  subject: yup.string().required("*Subject"),
  body: yup.string().required("*Main Body"),
});

function SendEmail({ toEmail }) {
  const [show, setShow] = useState(false);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");
  const [loadIndicator, setLoadIndicator] = useState(false);
  console.log("tomail",toEmail)

  const formik = useFormik({
    initialValues: {
      subject: "",
      body: "",
      files: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoadIndicator(true);

      try {
        const formData = new FormData();
        formData.append("to", toEmail);
        formData.append("from", userEmail);
        formData.append("subject", values.subject);
        formData.append("body", values.body);
        values.files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post(
          `${API_URL}sendMailWithAttachment`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success(response.data.message);
          handleHide();
          setLoadIndicator(false);
        } else {
          toast.error(response.data.message);
          setLoadIndicator(false);
        }
      } catch (error) {
        console.error(error);
        setLoadIndicator(false);
      }
    },
  });

  const handleShow = () => setShow(true);
  const handleHide = () => {
    formik.resetForm();
    setShow(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    formik.setFieldValue("files", [...formik.values.files, ...files]);
  };

  const handleFileRemove = (index) => {
    const files = formik.values.files.filter((_, i) => i !== index);
    formik.setFieldValue("files", files);
  };

  return (
    <div>
      <Tooltip TransitionComponent={Zoom} title="Send Mail">
      <Button
        className="fs-4 btn bg-primary bg-gradient mx-2 text-white shadow-none rounded-5"
        onClick={handleShow}
        style={{ padding: "2px 8px" }}
        disabled={role === "CMP_USER"}
      >
        <BiMailSend className="mb-1" />
      </Button>
      </Tooltip>
      <Offcanvas
        show={show}
        onHide={handleHide}
        className="emailHeader"
        placement="end"
      >
        <Offcanvas.Header>
          New Mail &nbsp;&nbsp;&nbsp;&nbsp;{" "}
          <button
            onClick={handleHide}
            className="btn border-dark fw-bold"
            style={{ color: "#fff", fontSize: "20px" }}
          >
            x
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={formik.handleSubmit}>
            <div
              className="d-flex align-items-center pb-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <img className="img-fluid" src={user} width={40} alt="user" />
              <p style={{ marginBottom: "0px" }}>
                {userName || "--"} ( {userEmail || "--"} )
              </p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <p style={{ marginBottom: "0px" }}>
                <b style={{ color: "#424242" }}>To :</b>
              </p>
              <p style={{ marginBottom: "0px" }}>{toEmail}</p>
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <input
                type="text"
                name="subject"
                id="subject"
                placeholder="Subject"
                style={{ border: "none" }}
                className={`form-control ${
                  formik.touched.subject && formik.errors.subject
                    ? "is-invalid"
                    : ""
                }`}
                {...formik.getFieldProps("subject")}
              />
            </div>
            <div
              className="d-flex align-items-center py-3"
              style={{ gap: "10px", borderBottom: "1px solid #d4d4d3" }}
            >
              <textarea
                name="body"
                placeholder="Mail Body"
                style={{ height: "250px", border: "none" }}
                className={`form-control ${
                  formik.touched.body && formik.errors.body ? "is-invalid" : ""
                }`}
                {...formik.getFieldProps("body")}
              ></textarea>
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <span
                style={{ minHeight: "80px", gap: "10px" }}
                className="d-flex align-items-center"
              >
                <span>
                  <label
                    htmlFor="file-input"
                    className="btn btn-outline-primary"
                  >
                    <GrAttachment />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    name="files"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple
                    accept=".jpg, .jpeg, .png, .gif, .pdf, .txt"
                  />
                  {formik.values.files.length > 0 ? (
                    <span>
                      &nbsp;{formik.values.files.length} files selected
                    </span>
                  ) : (
                    <span className="text-danger">
                      &nbsp;
                      <MdErrorOutline className="text-danger" />
                      &nbsp;{formik.errors.files}
                    </span>
                  )}
                </span>
              </span>
              <span className="d-flex" style={{ gap: "10px" }}>
                <button className="btn btn-primary" type="submit">
                  {loadIndicator && (
                    <span
                      className="spinner-border spinner-border-sm me-3"
                      aria-hidden="true"
                    ></span>
                  )}
                  &nbsp;<span role="status">Send</span>
                  <IoMdSend className="ms-2 mb-1" />
                </button>
              </span>
            </div>
            <div className="mt-3">
              {formik.values.files.map((file, index) => (
                <div key={index} className="d-flex align-items-center">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="btn btn-danger ms-2"
                    onClick={() => handleFileRemove(index)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendEmail;
