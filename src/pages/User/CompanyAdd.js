import React, { useEffect, useState } from "react";
// import User from "../../assets/user.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../../styles/dummy.css";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required("*Company Name is required"),
  companyEmail: Yup.string()
    .email("Invalid email")
    .required("*Email is required"),
  companyMobile: Yup.string()
    .required("Phone number is required")
    .test("phone-length", function (value) {
      const { countryCode } = this.parent;
      if (value && /\s/.test(value)) {
        return this.createError({
          message: "Phone number should not contain spaces",
        });
      }
      if (countryCode === "65") {
        return value && value.length === 8
          ? true
          : this.createError({ message: "Phone number must be 8 digits only" });
      }
      if (countryCode === "91") {
        return value && value.length === 10
          ? true
          : this.createError({
              message: "Phone number must be 10 digits only",
            });
      }
      return false; // Default validation for other country codes
    }),
  companyCountry: Yup.string().required("*Country is required"),
  companyStreet: Yup.string().required("*Street is required"),
  companyCity: Yup.string().required("*City is required"),
  companyState: Yup.string().required("*State is required"),
  companyZipCode: Yup.number().typeError("*ZipCode is must be a number").required("*ZipCode is required"),
});

function CompanyAdd() {
  const navigate = useNavigate();
  const owner = sessionStorage.getItem("user_name");
  // const token = sessionStorage.getItem("token");
  // const [userImage, setUserImage] = useState(User);
  // const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  // const [sameAsShipping, setSameAsShipping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loadIndicator, setLoadIndicator] = useState(false);
  console.log("logo",logo);
  // const { id } = useParams();

  const formik = useFormik({
    initialValues: {
      company_id: companyId,
      companyOwnerName: owner,
      file: "",
      companyName: "",
      companyEmail: "",
      companyMobile: "",
      countryCode: "65",
      website: "",
      companyStreet: "",
      companyCity: "",
      companyState: "",
      companyZipCode: "",
      companyCountry: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      console.log("company Datas:", data);
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("companyName", data.companyName);
      formData.append("companyEmail", data.companyEmail);
      formData.append("website", data.website);
      formData.append("companyMobile", data.companyMobile);
      formData.append("countryCode", data.countryCode);
      formData.append("companyStreet", data.companyStreet);
      formData.append("companyCity", data.companyCity);
      formData.append("companyState", data.companyState);
      formData.append("companyZipCode", data.companyZipCode);
      formData.append("companyCountry", data.companyCountry);
      setLoadIndicator(true);
      try {
        const response = await axios.put(
          `${API_URL}updateCompanyRegisterWithLogo/${companyId}`,
          formData
        );
        // console.log(response);
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/users");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error?.response?.data?.message);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("file", file);
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}getAllCompanyRegisterById/${companyId}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        const getData = response.data;
        setLogo(response.data.companyLogo)
        const payload = {
          company_id: companyId,
          companyOwnerName: getData.companyOwnerName,
          companyLogo: getData.companyLogo,
          companyName: getData.companyName,
          companyEmail: getData.companyEmail,
          companyMobile: getData.companyMobile,
          website: getData.website,
          countryCode: getData.countryCode || "65",
          companyStreet: getData.companyStreet,
          companyCity: getData.companyCity,
          companyState: getData.companyState,
          companyZipCode: getData.companyZipCode,
          companyCountry: getData.companyCountry,
        };
        formik.setValues(payload);
        console.log("getData", getData);
      } catch (error) {
        toast.error(`Error fetching data: ${error.message}`);
      }
    };
    userData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12"></div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <span>
                <Link to="/users">
                  <button className="btn btn-danger">Cancel</button>
                </Link>
              </span>
              &nbsp;
              <span>
                <button className="btn btn-primary" type="submit">
                  Update
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="container-fluid my-5">
          <h4>
            <b>Update Company</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Owner</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyOwnerName")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyOwnerName &&
                    formik.errors.companyOwnerName
                      ? "is-invalid"
                      : ""
                  }`}
                  id="companyOwnerName"
                  name="companyOwnerName"
                  value={owner}
                  readOnly
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyOwnerName &&
                    formik.errors.companyOwnerName && (
                      <p className="text-danger">
                        {formik.errors.companyOwnerName}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Company Logo</label>
                &nbsp;&nbsp;
                <input
                  type="file"
                  name="file"
                  className={`form-size form-control ${
                    formik.touched.file && formik.errors.file
                      ? "is-invalid"
                      : ""
                  }`}
                  onChange={handleFileChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.file && formik.errors.file ? (
                  <div className="invalid-feedback">{formik.errors.file}</div>
                ) : null}
              </div>
              {selectedFile ? (
                <div className="d-flex justify-content-end align-items-center mt-2">
                  {selectedFile.type.startsWith("image") && (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Selected File"
                      style={{ maxHeight: "100px" }}
                    />
                  )}
                </div>
              ):(<div className="d-flex justify-content-end align-items-center mt-2">
                    <img
                      src={logo}
                      alt="logo..."
                      style={{ maxHeight: "100px" }}
                    />
                </div>)}
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Name</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyName && formik.errors.companyName
                      ? "is-invalid"
                      : ""
                  }`}
                  {...formik.getFieldProps("companyName")}
                  id="companyName"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyName && formik.errors.companyName && (
                    <p className="text-danger">{formik.errors.companyName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Company Email</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyEmail")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyEmail && formik.errors.companyEmail
                      ? "is-invalid"
                      : ""
                  }`}
                  id="companyEmail"
                  name="companyEmail"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyEmail &&
                    formik.errors.companyEmail && (
                      <div className="text-danger ">
                        {formik.errors.companyEmail}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Company Mobile</label>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      className={`form-size form-select  ${
                        formik.touched.countryCode && formik.errors.countryCode
                          ? "is-invalid"
                          : ""
                      }`}
                      {...formik.getFieldProps("countryCode")}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                      name="countryCode"
                      id="countryCode"
                    >
                      <option value="65">+65</option>
                      <option value="91">+91</option>
                    </select>
                  </div>
                  <input
                    {...formik.getFieldProps("companyMobile")}
                    type="tel"
                    name="companyMobile"
                    id="companyMobile"
                    className={`form-size form-control  ${
                      formik.touched.companyMobile &&
                      formik.errors.companyMobile
                        ? "is-invalid"
                        : ""
                    }`}
                    aria-label="Text input with checkbox"
                  />
                </div>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyMobile &&
                    formik.errors.companyMobile && (
                      <div className="text-danger ">
                        {formik.errors.companyMobile}
                      </div>
                    )}
                </div>
              </div>
            </div> */}

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Company Mobile</lable>
                <span className="text-danger">*</span>&nbsp;&nbsp;
                <div className="input-group" style={{ width: "60%" }}>
                  <div>
                    <select
                      {...formik.getFieldProps("countryCode")}
                      id="countryCode"
                      name="countryCode"
                      className={`form-size form-control  ${
                        formik.touched.countryCode && formik.errors.countryCode
                          ? "is-invalid"
                          : ""
                      }`}
                      style={{
                        width: "80px",
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                      }}
                    >
                      <option value="65" selected>
                        +65
                      </option>
                      <option value="91">+91</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="companyMobile"
                    className={`form-size form-control  ${
                      formik.touched.companyMobile &&
                      formik.errors.companyMobile
                        ? "is-invalid"
                        : ""
                    }`}
                    {...formik.getFieldProps("companyMobile")}
                    id="companyMobile"
                    aria-label="Text input with checkbox"
                  />
                </div>
              </div>

              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyMobile &&
                    formik.errors.companyMobile && (
                      <p className="text-danger">
                        {formik.errors.companyMobile}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Website</lable>&nbsp;&nbsp;
                
                <input
                  {...formik.getFieldProps("website")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.website && formik.errors.website
                      ? "is-invalid"
                      : ""
                  }`}
                  id="website"
                  name="website"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.website && formik.errors.website && (
                    <div className="text-danger ">{formik.errors.website}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Address Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            {/* Street */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Street<span className="text-danger">*</span></label> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyStreet")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyStreet && formik.errors.companyStreet
                      ? "is-invalid"
                      : ""
                  }`}
                  name="companyStreet"
                  id="companyStreet"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyStreet && formik.errors.companyStreet && (
                    <div className="text-danger ">{formik.errors.companyStreet}</div>
                  )}
                </div>
              </div>
            </div>

            {/* City */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>City<span className="text-danger">*</span></label> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyCity")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyCity && formik.errors.companyCity
                      ? "is-invalid"
                      : ""
                  }`}
                  name="companyCity"
                  id="companyCity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyCity && formik.errors.companyCity && (
                    <div className="text-danger ">{formik.errors.companyCity}</div>
                  )}
                </div>
              </div>
            </div>

            {/* State */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>State<span className="text-danger">*</span></label> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyState")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyState && formik.errors.companyState
                      ? "is-invalid"
                      : ""
                  }`}
                  name="companyState"
                  id="companyState"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyState && formik.errors.companyState && (
                    <div className="text-danger ">{formik.errors.companyState}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Zip Code */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Code<span className="text-danger">*</span></label> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyZipCode")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyZipCode && formik.errors.companyZipCode
                      ? "is-invalid"
                      : ""
                  }`}
                  name="companyZipCode"
                  id="companyZipCode"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyZipCode && formik.errors.companyZipCode && (
                    <div className="text-danger ">{formik.errors.companyZipCode}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Country */}
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <label>Country<span className="text-danger">*</span></label> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("companyCountry")}
                  type="text"
                  className={`form-size form-control  ${
                    formik.touched.companyCountry && formik.errors.companyCountry
                      ? "is-invalid"
                      : ""
                  }`}
                  name="companyCountry"
                  id="companyCountry"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.companyCountry && formik.errors.companyCountry && (
                    <div className="text-danger ">{formik.errors.companyCountry}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default CompanyAdd;
