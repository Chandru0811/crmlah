import React from "react";
// import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as yup from "yup";
import { useFormik } from "formik";
import UseScrollToError from "../UseScrollToError";

const validationSchema = yup.object().shape({
  serviceName: yup.string().required("*Service name is required"),
  serviceOwner: yup.string().required("*Service owner is required"),
  duration: yup.string().required("*Duration is required"),
  location: yup.string().required("*Location is required"),
  members: yup.string().required("*Members is required"),
  availableDays: yup.string().required("*Available days is required"),
  availableTime: yup.string().required("*Available time is required"),
  price: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Price is required"),
  tax: yup
    .string()
    .matches(/^\d+$/, "Must be only digits")
    .required("*Tax is required"),
});

function ServicesCreate() {
  const companyId = sessionStorage.getItem("companyId");
  const owner = sessionStorage.getItem("user_name");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      serviceOwner: owner,
      companyId: companyId,
      serviceName: "",
      duration: "",
      location: "",
      members: "",
      availableDays: "",
      availableTime: "",
      price: "",
      tax: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("Service Datas:", data);
      try {
        const response = await axios.post(`${API_URL}newServices`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/services");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post(`${API_URL}newService`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response.status === 201) {
  //       toast.success("Service Created Successfully.");
  //       navigate("/services");
  //     } else {
  //       toast.error("Service Created Unsuccessful.");
  //     }
  //   } catch (error) {
  //     toast.error("Failed: " + error.message);
  //   }
  // };
  UseScrollToError(formik)

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Service</b>
                <br></br>
                {/* <img
                  src={User}
                  className="img-fluid"
                  style={{ width: "70px", height: "70px" }}
                  alt="user"
                /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <span>
                <Link to={"/services"}>
                  <button className="btn btn-danger">Cancel</button>
                </Link>
              </span>
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
            <b>Service Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <label htmlFor="serviceOwner">Service Owner</label>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  id="serviceOwner"
                  className={`form-size form-control  ${
                    formik.touched.serviceOwner && formik.errors.serviceOwner
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("serviceOwner")}
                  name="serviceOwner"
                  value={owner}
                  readOnly
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.serviceOwner &&
                    formik.errors.serviceOwner && (
                      <p className="text-danger">
                        {formik.errors.serviceOwner}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Service Name</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.serviceName && formik.errors.serviceName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("serviceName")}
                  name="serviceName"
                  id="serviceName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.serviceName && formik.errors.serviceName && (
                    <p className="text-danger">{formik.errors.serviceName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Duration</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="duration"
                  className={`form-size form-select  ${
                    formik.touched.duration && formik.errors.duration
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("duration")}
                  name="duration"
                >
                  <option value=""></option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="4 Hours">4 Hours</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.duration && formik.errors.duration && (
                    <p className="text-danger">{formik.errors.duration}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Location</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="location"
                  className={`form-size form-select  ${
                    formik.touched.location && formik.errors.location
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("location")}
                  name="location"
                >
                  <option value=""></option>
                  <option value="Business Address">Business Address</option>
                  <option value="Client Address">Client Address</option>
                  <option value="Business Address and Client Address">
                    Business Address and Client Address
                  </option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-danger">{formik.errors.location}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Member(s)</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="tel"
                  className={`form-size form-control  ${
                    formik.touched.members && formik.errors.members
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("members")}
                  name="members"
                  id="members"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.members && formik.errors.members && (
                    <p className="text-danger">{formik.errors.members}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Availability Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Available Day(s)</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="availableDays"
                  className={`form-size form-select  ${
                    formik.touched.availableDays && formik.errors.availableDays
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("availableDays")}
                  name="availableDays"
                >
                  <option value=""></option>
                  <option value="Every Business Days">
                    Every Business Days
                  </option>
                  <option value="Specific Date Range">
                    Specific Date Range
                  </option>
                  <option value="Specific Date(s)">Specific Date(s)</option>
                  <option value="Specific Day(s)">Specific Day(s)</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.availableDays &&
                    formik.errors.availableDays && (
                      <p className="text-danger">
                        {formik.errors.availableDays}
                      </p>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Available Time</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <select
                  id="availableTime"
                  className={`form-size form-select  ${
                    formik.touched.availableTime && formik.errors.availableTime
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("availableTime")}
                  name="availableTime"
                >
                  <option value=""></option>
                  <option value="Same as Business Time">
                    Same as Business Time
                  </option>
                  <option value="10.00AM to 12.00PM">10.00AM to 12.00PM</option>
                  <option value="12.00PM to 2.00PM">12.00PM to 2.00PM</option>
                  <option value="2.00PM to 4.00PM">2.00PM to 4.00PM</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.availableTime &&
                    formik.errors.availableTime && (
                      <p className="text-danger">
                        {formik.errors.availableTime}
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Price Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Price</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.price && formik.errors.price
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("price")}
                  name="price"
                  id="price"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-danger">{formik.errors.price}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Tax</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.tax && formik.errors.tax ? "is-invalid" : ""
                  }`}
                  {...formik.getFieldProps("tax")}
                  name="tax"
                  id="tax"
                />
              </div>
              <div className="row">
                <div className="col-5"></div>
                <div className="col-6">
                  {formik.touched.tax && formik.errors.tax && (
                    <p className="text-danger">{formik.errors.tax}</p>
                  )}
                </div>
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
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Description</lable> &nbsp;&nbsp;
                <textarea
                  rows="5"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("description_info")}
                  name="description_info"
                  id="description_info"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ServicesCreate;
