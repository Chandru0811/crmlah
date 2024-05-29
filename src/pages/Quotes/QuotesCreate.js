import React, { useEffect, useState } from "react";
import User from "../../assets/user.png";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/URL";
import { useFormik } from "formik";
import * as yup from "yup";
import { FaTrash } from "react-icons/fa";
// import { FaCamera } from "react-icons/fa6";
import "../../styles/dummy.css";

const validationSchema = yup.object().shape({
  quoteOwner: yup.string().required("*Quote owner is required"),
  dealName: yup.string().required("*Quote Name is required"),
  subject: yup.string().required("*Enter the Subject"),
  quoteStage: yup.string().required("*Enter the Quotes Stage"),
  validUntil: yup.string().required("*Select Valid Until"),
  shippingCode: yup.number()
    .typeError('Shipping code must be a number')
    .integer('Shipping code must be an integer'),
  billingCode: yup.number()
    .typeError('Billing code must be a number')
    .integer('Billing code must be an integer'),
});

function QuotesCreate() {
  const [rows, setRows] = useState([{}]);
  console.log(rows);
  const [adjustment, setAdjustment] = React.useState(0);
  const [grandTotal, setGrandTotal] = React.useState(0);
  const owner = sessionStorage.getItem("user_name");
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const companyId = sessionStorage.getItem("companyId");
  const [productOptions, setProductOptions] = useState([]);
  // console.log("productOptions:", productOptions);
  const [accountOption, setAccountOption] = useState([]);
  // console.log(accountOption);
  const [dealOption, setDealOption] = useState([]);
  // console.log(dealOption);/
  const [contactOption, setContactOption] = useState([]);
  // console.log(contactOption);
  const [userImage, setUserImage] = useState(User);
  const navigate = useNavigate();

  const addRow = () => {
    const updatedRows = [...rows, {}];
    setRows(updatedRows);

    const updatedQuotesItemList = [
      ...formik.values.quotesItemList,
      {
        productId: "",
        quantity: "",
        listPrice: "",
        amount: "",
        discount: "",
        tax: "",
        total: "",
      },
    ];
    formik.setFieldValue("quotesItemList", updatedQuotesItemList);
  };

  const deleteRow = () => {
    if (rows.length === 1) {
      // Prevent deleting the last row
      return;
    }

    const updatedRows = rows.slice(0, -1);
    setRows(updatedRows);

    const updatedQuotesItemList = formik.values.quotesItemList.slice(0, -1);
    formik.setFieldValue("quotesItemList", updatedQuotesItemList);
  };

  const formik = useFormik({
    initialValues: {
      companyId: companyId,
      quoteOwner: owner,
      itemDescription: "",
      description: "",
      termsAndConditions: "",
      subTotal: "",
      txnDiscount: "",
      txnTax: "",
      adjustment: "",
      grandTotal: "",
      subject: "",
      quoteStage: "",
      dealName: "",
      validUntil: "",
      contactName: "",
      accountName: "",
      billingStreet: "",
      billingCity: "",
      billingState: "",
      billingCode: "",
      billingCountry: "",
      shippingStreet: "",
      shippingCity: "",
      shippingState: "",
      shippingCode: "",
      shippingCountry: "",
      quotesItemList: [
        {
          productName: "",
          productId: "",
          quantity: "",
          listPrice: "",
          amount: "",
          discount: "",
          tax: "",
          total: "",
        },
      ],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Quotes Create:", values);
      try {
        const payload = {
          transactionQuotes: {
            companyId: companyId,
            itemDescription: values.itemDescription,
            description: values.description,
            termsAndConditions: values.termsAndConditions,
            subTotal: values.subTotal,
            txnDiscount: values.txnDiscount,
            txnTax: values.txnTax,
            adjustment: values.adjustment,
            grandTotal: values.grandTotal,
            quoteOwner: values.quoteOwner,
            subject: values.subject,
            quoteStage: values.quoteStage,
            dealName: values.dealName,
            validUntil: values.validUntil,
            contactName: values.contactName,
            accountName: values.accountName,
            billingStreet: values.billingStreet,
            billingCity: values.billingCity,
            billingState: values.billingState,
            billingCode: values.billingCode,
            billingCountry: values.billingCountry,
            shippingStreet: values.shippingStreet,
            shippingCity: values.shippingCity,
            shippingState: values.shippingState,
            shippingCode: values.shippingCode,
            shippingCountry: values.shippingCountry,
          },
          quotesItemList: rows.map((item) => ({
            productName: item.ProductName,
            productId: item.selectedOption,
            quantity: item.quantity,
            listPrice: item.listPrice,
            amount: item.amount,
            discount: parseInt(item.discount),
            tax: parseInt(item.tax),
            total: parseInt(item.total),
          })),
        };
        console.log("Payload:", payload);
        const response = await axios.post(
          `${API_URL}createTransactionQuotesAndQuoteItems`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.message);
          navigate("/quotes");
          console.log("Create Quotes Data:", response.data);
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

  const ProductList = async () => {
    try {
      const response = await axios(
        `${API_URL}allProductsByCompanyId/${companyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductOptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSelectChange = async (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedOption = value;
    try {
      const response = await axios.get(`${API_URL}allProducts/${value}`, {
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });
      const productName = response.data.productName;
      const listPrice = response.data.unitPrice;
      const tax = response.data.tax;
      updatedRows[index].ProductName = productName;
      updatedRows[index].productId = response.data.id;
      updatedRows[index].listPrice = listPrice;
      updatedRows[index].quantity = 1;
      updatedRows[index].amount = listPrice; // Update amount based on list price
      updatedRows[index].tax = tax;
      updatedRows[index].discount = 0;
      updatedRows[index].total = parseInt(listPrice * (1 + tax / 100), 10);
      setRows(updatedRows);
      calculateTotals();
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].quantity = value === "" ? 0 : parseInt(value, 10); // Parse value to integer

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;

    updatedRows[index].amount = listPrice * quantity;

    // Calculate the total based on listPrice, quantity, discount, and tax
    updatedRows[index].total =
      (updatedRows[index].amount *
        (100 - updatedRows[index].discount) *
        (100 + updatedRows[index].tax)) /
      10000;

    setRows(updatedRows);
  };

  const handleDiscountChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].discount = value;

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = value || 0;
    const tax = updatedRows[index].tax || 0;

    updatedRows[index].amount = listPrice * quantity;

    // Calculate the total amount considering the discount and tax
    const totalAmountBeforeTax =
      updatedRows[index].amount * (1 - discount / 100);
    const totalAmount = totalAmountBeforeTax * (1 + tax / 100);

    updatedRows[index].total = totalAmount;

    setRows(updatedRows);
    calculateTotals();
  };

  const handleTaxChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].tax = value;

    const listPrice = updatedRows[index].listPrice || 0;
    const quantity = updatedRows[index].quantity || 0;
    const discount = updatedRows[index].discount || 0;
    const taxPercentage = value || 0;

    let taxAmount = 0;
    if (taxPercentage < 18) {
      // For tax below 18%, calculate tax amount
      taxAmount = (listPrice * quantity * taxPercentage) / 100;
    } else {
      // For tax 18% or above, calculate tax amount including cess
      const taxAmountBeforeCess = (listPrice * quantity * taxPercentage) / 100;
      taxAmount = taxAmountBeforeCess + (taxAmountBeforeCess * 1) / 100;
    }

    updatedRows[index].amount = listPrice * quantity;
    updatedRows[index].total =
      (updatedRows[index].amount * (100 - discount) * (100 + taxAmount)) /
      10000;

    setRows(updatedRows);
    calculateTotals();
  };


  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    rows.forEach((row) => {
      subtotal += parseInt(row.amount);
      totalDiscount += parseInt(row.discount);
      totalTax += parseInt(row.tax);
      grandTotal += parseInt(row.total);
    });

    formik.setFieldValue("subTotal", isNaN(subtotal) ? 0 : subtotal);
    formik.setFieldValue(
      "txnDiscount",
      isNaN(totalDiscount) ? 0 : totalDiscount
    );
    formik.setFieldValue("txnTax", isNaN(totalTax) ? 0 : totalTax);
    formik.setFieldValue("grandTotal", isNaN(grandTotal) ? 0 : grandTotal);
  };

  const handleAdjustmentChange = (e) => {
    const adjustmentValue = parseFloat(e.target.value);
    const newGrandTotal = (parseFloat(grandTotal) - adjustmentValue).toFixed(2);
    setAdjustment(adjustmentValue);
    formik.setFieldValue("grandTotal", newGrandTotal);
  };

  useEffect(() => {
    calculateTotals();
  }, [rows]);


  useEffect(() => {
    ProductList();
    AccountList();
    DealList();
    ContactList();
  }, []);

  return (
    <section className="createLead">
      <form onSubmit={formik.handleSubmit}>
        <div className="container-fluid">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 col-12">
              <h4>
                <b>Create Quote</b>
                <br></br>
                {/* <img
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
                /> */}
                {/* Input for image upload */}
                {/* <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <FaCamera className="cameraIcon" /> */}
              </h4>
            </div>
            <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-lg-end justify-content-md-end">
              <Link to={"/quotes"}>
                <button type="button" className="btn btn-danger">Cancel</button>
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

        {/*  Quotes Information */}
        <div className="container-fluid my-5">
          <h4>
            <b>Quotes Information</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device ">
                <lable>Quote Owner</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  name="quoteOwner"
                  className="form-control form-size"
                  {...formik.getFieldProps("quoteOwner")}
                  id="quoteOwner"
                  value={owner}
                  readOnly
                />
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quote Name</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  style={{ width: "60%" }}
                  name="dealName"
                  {...formik.getFieldProps("dealName")}
                  className={`form-control form-size ${formik.touched.dealName && formik.errors.dealName
                    ? "is-invalid"
                    : ""
                    }`}
               />
                  
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.dealName && formik.errors.dealName && (
                    <div className="text-danger ">{formik.errors.dealName}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Subject</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  type="text"
                  name="subject"
                  {...formik.getFieldProps("subject")}
                  className={`form-control form-size ${formik.touched.subject && formik.errors.subject
                    ? "is-invalid"
                    : ""
                    }`}
                  id="subject"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.subject && formik.errors.subject && (
                    <div className="text-danger ">{formik.errors.subject}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Quotes Stage</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <select
                  name="quoteStage"
                  {...formik.getFieldProps("quoteStage")}
                  type="text"
                  className={`form-select form-size ${formik.touched.quoteStage && formik.errors.quoteStage
                    ? "is-invalid"
                    : ""
                    }`}
                  id="quoteStage"
                >
                  <option value=""></option>
                  <option value="Analysed">Analysed</option>
                  <option value="Processed">Processed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Intermediated">Intermediated</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.quoteStage && formik.errors.quoteStage && (
                    <div className="text-danger ">
                      {formik.errors.quoteStage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Valid Until</lable>
                <span className="text-danger">*</span> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("validUntil")}
                  type="date"
                  className={`form-control form-size ${formik.touched.validUntil && formik.errors.validUntil
                    ? "is-invalid"
                    : ""
                    }`}
                  name="validUntil"
                  id="validUntil"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.validUntil && formik.errors.validUntil && (
                    <div className="text-danger ">
                      {formik.errors.validUntil}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
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
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Account Name</lable> &nbsp;&nbsp;
                <select
                  name="accountName"
                  style={{ width: "60%" }}
                  {...formik.getFieldProps("accountName")}
                  className={`form-select form-size ${formik.touched.accountName && formik.errors.accountName
                    ? "is-invalid"
                    : ""
                    }`}
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
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.accountName && formik.errors.accountName && (
                    <div className="text-danger ">
                      {formik.errors.accountName}
                    </div>
                  )}
                </div>
              </div>
            </div> */}

            {/* <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Contact Name</lable> &nbsp;&nbsp;
                <select
                  name="contactName"
                  style={{ width: "60%" }}
                  {...formik.getFieldProps("contactName")}
                  className={`form-select form-size ${formik.touched.contactName && formik.errors.contactName
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
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.contactName && formik.errors.contactName && (
                    <div className="text-danger ">
                      {formik.errors.contactName}
                    </div>
                  )}
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/*  Address Information */}
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
                  {...formik.getFieldProps("shippingStreet")}
                  type="text"
                  className={`form-control form-size ${formik.touched.shippingStreet &&
                    formik.errors.shippingStreet
                    ? "is-invalid"
                    : ""
                    }`}
                  name="shippingStreet"
                  id="shippingStreet"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shippingStreet &&
                    formik.errors.shippingStreet && (
                      <div className="text-danger ">
                        {formik.errors.shippingStreet}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12  mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Street</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billingStreet")}
                  type="text"
                  className={`form-control form-size ${formik.touched.billingStreet && formik.errors.billingStreet
                    ? "is-invalid"
                    : ""
                    }`}
                  name="billingStreet"
                  id="billingStreet"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billingStreet &&
                    formik.errors.billingStreet && (
                      <div className="text-danger ">
                        {formik.errors.billingStreet}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shippingCity")}
                  type="text"
                  className={`form-control form-size ${formik.touched.shippingCity && formik.errors.shippingCity
                    ? "is-invalid"
                    : ""
                    }`}
                  name="shippingCity"
                  id="shippingCity"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shippingCity &&
                    formik.errors.shippingCity && (
                      <div className="text-danger ">
                        {formik.errors.shippingCity}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing City</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billingCity")}
                  type="text"
                  className={`form-control form-size ${formik.touched.billingCity && formik.errors.billingCity
                    ? "is-invalid"
                    : ""
                    }`}
                  name="billingCity"
                  id="billingCity"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billingCity && formik.errors.billingCity && (
                    <div className="text-danger ">
                      {formik.errors.billingCity}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shippingCode")}
                  type="text"
                  className={`form-size form-control  ${formik.touched.shippingCode && formik.errors.shippingCode
                    ? "is-invalid"
                    : ""
                    }`}
                  name="shippingCode"
                  id="shippingCode"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shippingCode &&
                    formik.errors.shippingCode && (
                      <div className="text-danger ">
                        {formik.errors.shippingCode}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing Code</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billingCode")}
                  type="text"
                  className={`form-size form-control  ${formik.touched.billingCode && formik.errors.billingCode
                    ? "is-invalid"
                    : ""
                    }`}
                  name="billingCode"
                  id="billingCode"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billingCode &&
                    formik.errors.billingCode && (
                      <div className="text-danger ">
                        {formik.errors.billingCode}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Shipping State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shippingState")}
                  type="text"
                  className={`form-control form-size ${formik.touched.shippingState && formik.errors.shippingState
                    ? "is-invalid"
                    : ""
                    }`}
                  name="shippingState"
                  id="shippingState"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shippingState &&
                    formik.errors.shippingState && (
                      <div className="text-danger ">
                        {formik.errors.shippingState}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Billing State</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billingState")}
                  type="text"
                  className={`form-control form-size ${formik.touched.billingState && formik.errors.billingState
                    ? "is-invalid"
                    : ""
                    }`}
                  name="billingState"
                  id="billingState"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billingState &&
                    formik.errors.billingState && (
                      <div className="text-danger ">
                        {formik.errors.billingState}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3 ">
              <div className="d-flex align-items-center justify-content-end sm-device">
                <lable>Shipping Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("shippingCountry")}
                  type="text"
                  className={`form-control form-size ${formik.touched.shippingCountry &&
                    formik.errors.shippingCountry
                    ? "is-invalid"
                    : ""
                    }`}
                  name="shippingCountry"
                  id="shippingCountry"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.shippingCountry &&
                    formik.errors.shippingCountry && (
                      <div className="text-danger ">
                        {formik.errors.shippingCountry}
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 col-12 mb-3">
              <div className="d-flex align-items-center justify-content-end  sm-device">
                <lable>Billing Country</lable> &nbsp;&nbsp;
                <input
                  {...formik.getFieldProps("billingCountry")}
                  type="text"
                  className={`form-control form-size ${formik.touched.billingCountry &&
                    formik.errors.billingCountry
                    ? "is-invalid"
                    : ""
                    }`}
                  name="billingCountry"
                  id="billingCountry"
                />
              </div>
              <div className="row sm-device">
                <div className="col-5"></div>
                <div className="col-6 sm-device">
                  {formik.touched.billingCountry &&
                    formik.errors.billingCountry && (
                      <div className="text-danger ">
                        {formik.errors.billingCountry}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotes Items Table */}
        <div className="container-fluid my-5">
          <h4>
            <b>Quotes Items</b>
          </h4>
        </div>
        <div className="container">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    Product Name
                  </th>
                  <th scope="col">Quantity</th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    List Price
                  </th>
                  <th scope="col">Amount</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Tax</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody className="table-secondary">
                {rows.map((row, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <select
                        className="form-select"
                        name={`quotesItemList[${index}].productName`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].productName`
                        )}
                        value={row.productName}
                        onChange={(e) =>
                          handleSelectChange(index, e.target.value)
                        }
                      >
                        <option selected value=""></option>
                        {productOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.productName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].quantity`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].quantity`
                        )}
                        value={row.quantity}
                        className="form-control"
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].listPrice`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].listPrice`
                        )}
                        value={row.listPrice}
                        className="form-control"
                        id={`listPrice_${index}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].amount`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].amount`
                        )}
                        value={row.amount}
                        className="form-control"
                        id={`amount_${index}`}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].discount`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].discount`
                        )}
                        value={row.discount}
                        className="form-control"
                        onChange={(e) =>
                          handleDiscountChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].tax`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].tax`
                        )}
                        value={row.tax}
                        readOnly
                        className="form-control"
                        onChange={(e) => handleTaxChange(index, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name={`quotesItemList[${index}].total`}
                        {...formik.getFieldProps(
                          `quotesItemList[${index}].total`
                        )}
                        value={row.total ? row.total.toFixed(2) : 0}
                        className="form-control"
                        id={`total_${index}`}
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-primary" onClick={addRow}>
            Add Row
          </button>
          {rows.length > 1 && (
            <button
              type="button"
              className="btn btn-outline-danger mx-3"
              onClick={deleteRow}
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* Quotes Items Counts */}
        <div className="container-fluid">
          <div className="container-fluid row mt-5 mx-2">
            <div className="container-fluid p-3 col-md-8"></div>
            <div className="container-fluid p-3 col-md-4 col-12 border rounded">
              <div className="container-fluid py-2">
                <label className="text-dark text-end">Sub Total(SGT)</label>
                <input
                  {...formik.getFieldProps("subTotal")}
                  name="subTotal"
                  className="form-control p-1"
                  type="text"
                  readOnly
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Discount(%)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("txnDiscount")}
                  name="txnDiscount"
                  readOnly
                />
              </div>
              <div className="container-fluid py-2">
                <label className="text-dark">Tax(%)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("txnTax")}
                  name="txnTax"
                  readOnly
                />
              </div>
              {/* <div className="container-fluid py-2">
                <label className="text-dark">Adjustment(Rs.)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("adjustment")}
                  value={adjustment}
                />
              </div> */}
              <div className="container-fluid py-2">
                <label className="text-dark">Grand Total(SGT)</label>
                <input
                  className="form-control p-1"
                  type="text"
                  {...formik.getFieldProps("grandTotal")}
                  name="grandTotal"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="container-fluid my-5">
          <h4>
            <b>Terms and Conditions</b>
          </h4>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-flex align-items-start justify-content-center mb-3 sm-device">
                <lable>Terms & Conditions</lable> &nbsp;&nbsp;
                <textarea
                  rows="3"
                  type="text"
                  className="form-size form-control"
                  {...formik.getFieldProps("termsAndConditions")}
                  name="termsAndConditions"
                  id="termsAndConditions"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description Information */}
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

export default QuotesCreate;
