import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { Table, Button } from "react-bootstrap";
import { FaCamera } from "react-icons/fa6";
import { useFormik } from "formik";
import * as yup from "yup";
import "../../styles/dummy.css";

const validationSchema = yup.object().shape({
  deal_name: yup.string().required("*Select Deal Name"),
  subject: yup.string().required("*Enter the Subject"),
  quote_stage: yup.string().required("*Enter the Quotes Stage"),
  valid_until: yup.string().required("*Select Valid Until"),
  account_name: yup.string().required("*Select Account Name"),
  contact_name: yup.string().required("*Select Contact Name"),
  shipping_street: yup.string().required("*Enter the Shipping Street"),
  billing_street: yup.string().required("*Enter the Billing Street"),
  shipping_city: yup.string().required("*Enter the Shipping City"),
  billing_city: yup.string().required("*Enter the Billing City"),
  shipping_code: yup.string().required("*Enter the Shipping Code"),
  billing_code: yup.string().required("*Enter the Billing Code"),
  shipping_state: yup.string().required("*Enter the Shipping State"),
  billing_state: yup.string().required("*Enter the Billing State"),
  shipping_country: yup.string().required("*Enter the Shipping Country"),
  billing_country: yup.string().required("*Enter the Billing Country"),
  terms_and_conditions: yup.string().required("*Enter the Product Names"),
});

function QuotesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const [accountOption, setAccountOption] = useState([]);
  // console.log("Account Name",accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log("Deal Name",dealOption);
  const [contactOption, setContactOption] = useState([]);
  // console.log("Contact Name",contactOption);

  const [userImage, setUserImage] = useState(User);
  const [rows, setRows] = useState([
    {
      product: "",
      itemQuantity: "",
      itemPrice: "",
      itemAmount: "",
      itemDiscount: "",
      itemTax: "",
      total_amount: "",
    },
  ]);

  const removeRow = (idToRemove) => {
    const updatedRows = rows.filter((row) => row.id !== idToRemove);
    setRows(updatedRows);
  };

  const formik = useFormik({
    initialValues: {
      company_id: userId,
      quote_owner: "",
      deal_name: "",
      subject: "",
      quote_stage: "",
      valid_until: "",
      account_name: "",
      contact_name: "",
      shipping_street: "",
      billing_street: "",
      shipping_city: "",
      billing_city: "",
      shipping_code: "",
      billing_code: "",
      shipping_state: "",
      billing_state: "",
      shipping_country: "",
      billing_country: "",
      total_amount: "",
      discount: "",
      tax: "",
      adjustment: "",
      grand_total: "",
      terms_and_conditions: "",
      description: "",
      quotes_items: rows,
    },
    validationSchema: validationSchema,
    onSubmit: async (data) => {
      // console.log("User Datas:", data);
      try {
        const response = await axios.put(
          `${API_URL}updateQuote/${id}`,
          data,

          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success(response.data.message);
          navigate("/quotes");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed: " + error.message);
      }
    },
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const AccountList = async () => {
    try {
      const response = await axios(`${API_URL}accountNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setAccountOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const DealList = async () => {
    try {
      const response = await axios(`${API_URL}dealNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setDealOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const ContactList = async () => {
    try {
      const response = await axios(`${API_URL}contactNamesList`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      setContactOption(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios(`${API_URL}allQuotes/${id}`, {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        });
        const getData = response.data;
        console.log(getData);
        const validstring = getData.validUntil;
        const validUntilDate = new Date(validstring);
        console.log(validUntilDate);
        //  const validUntil = validUntilDate.toLocaleDateString();
        const validUntil = `${validUntilDate.getFullYear()}-${(
          validUntilDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${validUntilDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        //  console.log("validUntil",validUntil)

        const payload = {
          product: getData.product,
          quantity: getData.quantity,
          price: getData.price,
          discount: getData.discount,
          total_amount: getData.totalAmount,
          itemDescription: getData.itemDescription,
          description: getData.description,
          terms_and_conditions: getData.termsAndConditions,
          tax: getData.tax,
          adjustment: getData.adjustment,
          grand_total: getData.grandTotal,
          quote_owner: getData.quoteOwner,
          subject: getData.subject,
          quote_stage: getData.quoteStage,
          deal_name: getData.dealName,
          valid_until: validUntil,
          contact_name: getData.contactName,
          account_name: getData.accountName,
          billing_street: getData.billingStreet,
          billing_city: getData.billingCity,
          billing_state: getData.billingState,
          billing_code: getData.billingCode,
          billing_country: getData.billingCountry,
          shipping_street: getData.shippingStreet,
          shipping_city: getData.shippingCity,
          shipping_state: getData.shippingState,
          shipping_code: getData.shippingCode,
          shipping_country: getData.shippingCountry,
          createdAt: "created_at",
          createdBy: "created_by",
          updatedAt: "updated_at",
          updatedBy: "updated_by",
          companyId: "company_id",
        };

        formik.setValues(payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    userData();
    AccountList();
    DealList();
    ContactList();
  }, [id]);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Update Quote</b>
                <br></br>
                <img
                  src={userImage}
                  className="img-fluid mt-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  alt="user"
                  onClick={() => document.getElementById("imageInput").click()}
                />
                {/* Input for image upload */}
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" />
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <span>
                <Link to="/quotes">
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
            <b>Quotes Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device ">
                <lable>Quote Owner</lable> &nbsp;&nbsp;
                <select
                  type="text"
                  name="quote_owner"
                  className="form-select form-size"
                  {...formik.getFieldProps("quote_owner")}
                  id="quote_owner"
                >
                  <option value={owner}>{owner}</option>
                  <option value="Vignesh Devan">Vignesh Devan</option>
                  <option value="Chandru R">Chandru R</option>
                  <option value="Gayathri M">Gayathri M</option>
                  <option value="Poongodi K">Poongodi K</option>
                  <option value="Suriya G">Suriya G</option>
                  <option value="Leela Prasanna D">Leela Prasanna D</option>
                  <option value="Saravanan M">Saravanan M</option>
                  <option value="Nagaraj VR">Nagaraj VR</option>
                  <option value="Yalini A">Yalini A</option>
                  <option value="Vishnu Priya">Vishnu Priya</option>
                  <option value="Kavitha">Kavitha</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Deal Name</lable> &nbsp;&nbsp;
                <select
                  style={{ width: "60%" }}
                  name="deal_name"
                  {...formik.getFieldProps("deal_name")}
                  className={`form-select form-size ${
                    formik.touched.deal_name && formik.errors.deal_name
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(dealOption) &&
                    dealOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.deal_name && formik.errors.deal_name && (
                    <div className="text-danger ">
                      {formik.errors.deal_name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Subject</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  name="subject"
                  {...formik.getFieldProps("subject")}
                  className={`form-control form-size ${
                    formik.touched.subject && formik.errors.subject
                      ? "is-invalid"
                      : ""
                  }`}
                  id="subject"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="text-danger ">{formik.errors.subject}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quotes Stage</lable> &nbsp;&nbsp;
                <select
                  name="quote_stage"
                  {...formik.getFieldProps("quote_stage")}
                  type="text"
                  className={`form-select form-size ${
                    formik.touched.quote_stage && formik.errors.quote_stage
                      ? "is-invalid"
                      : ""
                  }`}
                  id="quote_stage"
                >
                  <option value=""></option>
                  <option value="Analysed">Analysed</option>
                  <option value="Processed">Processed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Intermediated">Intermediated</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.quote_stage && formik.errors.quote_stage && (
                    <div className="text-danger ">
                      {formik.errors.quote_stage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Valid Until</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("valid_until")}
                  type="date"
                  className={`form-control form-size ${
                    formik.touched.valid_until && formik.errors.valid_until
                      ? "is-invalid"
                      : ""
                  }`}
                  name="valid_until"
                  id="valid_until"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.valid_until && formik.errors.valid_until && (
                    <div className="text-danger ">
                      {formik.errors.valid_until}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Team</lable> &nbsp;&nbsp;
                <input
                  type="text"
                  className="form-size form-control"
                  name="team"
                  id="team"
                  placeholder="--"
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  name="account_name"
                  style={{ width: "60%" }}
                  {...formik.getFieldProps("account_name")}
                  className={`form-select form-size ${
                    formik.touched.account_name && formik.errors.account_name
                      ? "is-invalid"
                      : ""
                  }`}
                  aria-label="Product"
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(accountOption) &&
                    accountOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.account_name &&
                    formik.errors.account_name && (
                      <div className="text-danger ">
                        {formik.errors.account_name}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable> &nbsp;&nbsp;
                <select
                  name="contact_name"
                  style={{ width: "60%" }}
                  {...formik.getFieldProps("contact_name")}
                  className={`form-select form-size ${
                    formik.touched.contact_name && formik.errors.contact_name
                      ? "is-invalid"
                      : ""
                  }`}
                >
                  <option value="" selected disabled></option>
                  {Array.isArray(contactOption) &&
                    contactOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.contact_name &&
                    formik.errors.contact_name && (
                      <div className="text-danger ">
                        {formik.errors.contact_name}
                      </div>
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
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Street</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_street")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.shipping_street &&
                    formik.errors.shipping_street
                      ? "is-invalid"
                      : ""
                  }`}
                  name="shipping_street"
                  id="shipping_street"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.shipping_street &&
                    formik.errors.shipping_street && (
                      <div className="text-danger ">
                        {formik.errors.shipping_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_street")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.billing_street &&
                    formik.errors.billing_street
                      ? "is-invalid"
                      : ""
                  }`}
                  name="billing_street"
                  id="billing_street"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.billing_street &&
                    formik.errors.billing_street && (
                      <div className="text-danger ">
                        {formik.errors.billing_street}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_city")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.shipping_city && formik.errors.shipping_city
                      ? "is-invalid"
                      : ""
                  }`}
                  name="shipping_city"
                  id="shipping_city"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.shipping_city &&
                    formik.errors.shipping_city && (
                      <div className="text-danger ">
                        {formik.errors.shipping_city}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_city")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.billing_city && formik.errors.billing_city
                      ? "is-invalid"
                      : ""
                  }`}
                  name="billing_city"
                  id="billing_city"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.billing_city &&
                    formik.errors.billing_city && (
                      <div className="text-danger ">
                        {formik.errors.billing_city}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_code")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.shipping_code && formik.errors.shipping_code
                      ? "is-invalid"
                      : ""
                  }`}
                  name="shipping_code"
                  id="shipping_code"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.shipping_code &&
                    formik.errors.shipping_code && (
                      <div className="text-danger ">
                        {formik.errors.shipping_code}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_code")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.billing_code && formik.errors.billing_code
                      ? "is-invalid"
                      : ""
                  }`}
                  name="billing_code"
                  id="billing_code"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.billing_code &&
                    formik.errors.billing_code && (
                      <div className="text-danger ">
                        {formik.errors.billing_code}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_state")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.shipping_state &&
                    formik.errors.shipping_state
                      ? "is-invalid"
                      : ""
                  }`}
                  name="shipping_state"
                  id="shipping_state"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.shipping_state &&
                    formik.errors.shipping_state && (
                      <div className="text-danger ">
                        {formik.errors.shipping_state}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_state")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.billing_state && formik.errors.billing_state
                      ? "is-invalid"
                      : ""
                  }`}
                  name="billing_state"
                  id="billing_state"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.billing_state &&
                    formik.errors.billing_state && (
                      <div className="text-danger ">
                        {formik.errors.billing_state}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shipping_country")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.shipping_country &&
                    formik.errors.shipping_country
                      ? "is-invalid"
                      : ""
                  }`}
                  name="shipping_country"
                  id="shipping_country"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.shipping_country &&
                    formik.errors.shipping_country && (
                      <div className="text-danger ">
                        {formik.errors.shipping_country}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billing_country")}
                  type="text"
                  className={`form-control form-size ${
                    formik.touched.billing_country &&
                    formik.errors.billing_country
                      ? "is-invalid"
                      : ""
                  }`}
                  name="billing_country"
                  id="billing_country"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.billing_country &&
                    formik.errors.billing_country && (
                      <div className="text-danger ">
                        {formik.errors.billing_country}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Quotes Items</b>
          </h4>
        </div>
        <div className="container-fluid">
          <div className="container p-0" style={{ overflowX: "scroll" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ position: "sticky", left: "0" }}>S.No</th>
                  <th>product Name</th>
                  <th>Quantity</th>
                  <th>List Price(Rs.)</th>
                  <th>Amount(Rs.)</th>
                  <th>Discount(Rs.)</th>
                  <th>Tax(Rs.)</th>
                  <th>Total(Rs.)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td
                      className="text-center fw-bold"
                      style={{ position: "sticky", left: "0" }}
                    >
                      <span>{row.id}</span>
                    </td>
                    <td>
                      <select
                        name="product"
                        className={`form-control p-1 w-150 ${
                          formik.touched.product && formik.errors.product
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("product")}
                      >
                        <option value=""></option>
                        <option value="Access laptop">Access laptop</option>
                        <option value="Lenovo laptop">Lenovo laptop</option>
                        <option value="Hp laptop">Hp laptop</option>
                        <option value="Dell laptop">Dell laptop</option>
                        <option value="Laptop">Laptop</option>
                        <option value="mobiles">mobiles</option>
                      </select>
                      <p className="text-danger m-0">
                        {/* {errors.product?.message} */}
                      </p>
                    </td>
                    <td>
                      <input
                        name="quantity"
                        type="text"
                        className={`form-control p-1  ${
                          formik.touched.itemQuantity &&
                          formik.errors.itemQuantity
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("itemQuantity")}
                      />
                    </td>
                    <td>
                      <input
                        name="price"
                        type="text"
                        className={`form-control p-1  ${
                          formik.touched.itemPrice && formik.errors.itemPrice
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("itemPrice")}
                      />
                    </td>
                    <td>
                      <input
                        name="amount"
                        type="text"
                        {...formik.getFieldProps("itemAmount")}
                        className={`form-control p-1  ${
                          formik.touched.itemAmount && formik.errors.itemAmount
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </td>
                    <td>
                      <input
                        name="discount"
                        type="text"
                        {...formik.getFieldProps("itemDiscount")}
                        className={`form-control p-1  ${
                          formik.touched.itemDiscount &&
                          formik.errors.itemDiscount
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </td>
                    <td>
                      <input
                        name="tax"
                        type="text"
                        className={`form-control p-1  ${
                          formik.touched.itemTax && formik.errors.itemTax
                            ? "is-invalid"
                            : ""
                        }`}
                        {...formik.getFieldProps("itemTax")}
                      />
                    </td>
                    <td>
                      <input
                        name="total_amount"
                        type="text"
                        {...formik.getFieldProps("total_amount")}
                        className={`form-control p-1  ${
                          formik.touched.total_amount &&
                          formik.errors.total_amount
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                    </td>
                    <td>
                      <Button
                        className="px-2 py-0 mx-1 my-0"
                        variant="danger"
                        style={{ borderRadius: "50%" }}
                        onClick={() => removeRow(row.id)}
                      >
                        x
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="container my-4">
            <Button
              variant="primary"
              onClick={() => {
                setRows((prevRows) => [...prevRows, {}]);
              }}
            >
              <FaPlus /> Add Row
            </Button>
          </div>

          <div className="container-fluid row mt-5 mx-2">
            <div className="container-fluid p-3 col-md-4 border rounded">
              <div className="container-fluid py-2">
                <label className="text-dark text-end">Sub Total(Rs.)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  placeholder="--"
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Discount(Rs.)</label>
                <input
                  name="discount"
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("discount")}
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Tax(Rs.)</label>
                <input
                  name="tax"
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("tax")}
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Adjustment(Rs.)</label>
                <input
                  name="adjustment"
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("adjustment")}
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Grand Total(Rs.)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  name="grand_total"
                  {...formik.getFieldProps("grand_total")}
                />
              </div>
            </div>
            <div className="container-fluid p-3 col-md-8"></div>
          </div>
        </div>

        <div className="container-fluid my-5">
          <h4>
            <b>Terms and Conditions</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-8 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Terms & Conditions</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("terms_and_conditions")}
                  type="text"
                  style={{ width: "70%" }}
                  className={`form-control ${
                    formik.touched.terms_and_conditions &&
                    formik.errors.terms_and_conditions
                      ? "is-invalid"
                      : ""
                  }`}
                  name="terms_and_conditions"
                  id="terms_and_conditions"
                />
              </div>
              <div className="row error-msg">
                <div className="col-5"></div>
                <div className="col-6 error-msg">
                  {formik.touched.terms_and_conditions &&
                    formik.errors.terms_and_conditions && (
                      <div className="text-danger ">
                        {formik.errors.terms_and_conditions}
                      </div>
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

export default QuotesEdit;
