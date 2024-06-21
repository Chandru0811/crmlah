import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("*Enter valid email")
    .required("*Email is required"),
  proposal_name: yup.string().required("*Proposal name is required"),
  proposalType: yup.string().required("*Proposal Type is required"),
  subject: yup.string().required("*Subject is required"),
  description: yup.string().required("*Description is required"),
  files: yup.string().required("*Attachment is required"),
});

function ProposalEdit() {
  const owner = sessionStorage.getItem("user_name");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [accountOption, setAccountOption] = useState([]);
  const [dealOption, setDealOption] = useState([]);
  const [contactOption, setContactOption] = useState([]);
  const token = sessionStorage.getItem("token");
  const [userImage, setUserImage] = useState(User);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      proposal_name: "Proposal A",
      proposalType: "Type A",
      subject: "Subject A",
      description: "Test",
      mailBody: "Mail",
      files: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("Deals Datas:", data);
      try {
        const response = await axios.post(`${API_URL}newProposal`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/proposal");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Edit Proposal</b>
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/proposal"}>
                <button className="btn btn-danger">Cancel</button>
              </Link>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Proposal Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Proposal Name</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control ${
                    formik.touched.proposal_name && formik.errors.proposal_name
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("proposal_name")}
                  id="proposal_name"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.proposal_name &&
                    formik.errors.proposal_name && (
                      <p className="text-danger">
                        {formik.errors.proposal_name}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Proposal Type</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <select
                  type="text"
                  className={`form-size form-select `}
                  {...formik.getFieldProps("proposalType")}
                  id="proposalType"
                >
                  <option value="Company Profile" selected>Company Profile</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Subject</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control ${
                    formik.touched.subject && formik.errors.subject
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("subject")}
                  id="subject"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.subject && formik.errors.subject && (
                    <p className="text-danger">{formik.errors.subject}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label>Attachment</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group">
                  <input
                    className={`form-control custom-file-input ${
                      formik.touched.files && formik.errors.files
                        ? "is-invalid"
                        : ""
                    }`}
                    type="file"
                    multiple
                    accept="image/*, video/*, application/pdf"
                    onChange={(event) =>
                      formik.setFieldValue(
                        "files",
                        Array.from(event.target.files)
                      )
                    }
                  />
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.files && formik.errors.files && (
                    <div className="text-danger">{formik.errors.files}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 mb-3 mt-2">
              <div className="d-flex align-items-start justify-content-center sm-device">
                <label>Mail Body</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description")}
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Description Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 mb-3 ">
              <div className="d-flex align-items-start justify-content-center sm-device">
                <label>Description</label> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description")}
                  name="description"
                  id="description"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ProposalEdit;
