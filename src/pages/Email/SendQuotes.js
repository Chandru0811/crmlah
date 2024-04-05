import React, { useState, useEffect } from "react";
import axios from "axios";

import { toast } from "react-toastify";

import { Button, Offcanvas } from "react-bootstrap";
import { GrAttachment } from "react-icons/gr";
import { IoMdSend, IoMdTime } from "react-icons/io";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import user from "../../assets/user.png";
import { API_URL } from "../../Config/URL";

function SendQuotes({ accountData }) {
  const [htmlContent, setHtmlContent] = useState("");
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const userName = sessionStorage.getItem("user_name");
  const userEmail = sessionStorage.getItem("email");
  const [subject, setSubject] = useState("");
  const handleShow = () => setShow(true);
  const handleHide = () => {
    setSelectedFiles([]);
    setShow(false);
  };

  useEffect(() => {
    generateInvoice(accountData);
  }, []);

  const generateInvoice = (data) => {
    if (data && data.quotes) {
      const tableRows = data.quotes.map(
        (row, index) => `
      <tr class="item">
        <td>${index + 1}</td>
        <td>${row.dealName}</td>
        <td>${row.subject}</td>
        <td>${row.quoteStage}</td>
        <td>${row.quoteOwner}</td>
      </tr>
    `
      );

      const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Invoice</title>
          <style>
            .invoice-box {
              font-size: 12px;
              max-width: 600px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              line-height: 24px;
              font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
              color: #555;
            }
  
            .invoice-box table {
              width: 100%;
              line-height: inherit;
              text-align: left;
            }
  
            .invoice-box table td {
              padding: 5px;
              vertical-align: top;
            }
  
            .invoice-box table td.third {
              text-align: right;
            }
  
            .invoice-box table tr.heading td {
              background: #eee;
              border-bottom: 1px solid #ddd;
              font-weight: bold;
            }
  
            .invoice-box table tr.item td {
              border-bottom: 1px solid #eee;
            }
  
            .invoice-box table tr.item.last td {
              border-bottom: none;
            }
  
            .invoice-box table tr.total td:nth-child(2) {
              border-top: 2px solid #eee;
              font-weight: bold;
            }
  
            #scan {
              float: right;
            }
  
            #scan img {
              max-width: 100%;
              height: auto;
            }
  
            @media print {
              .invoice-box {
                border: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <img src="https://ecscloudinfotech.com/ecs/static/media/logo1.9c3a01a2a3d275bf1c44.png"
                          style="width: 75%; max-width: 180px;" alt="Logo">
                      </td>
                      <td class="third">
                        <b>Date:</b> 24-01-2024<br>
                        The Alexcier,
                        237 Alexandra Road,<br>
                        #04-10,
                        Singapore-159929.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
    
            <div style="max-width: 590px; overflow: auto;">
              <table>
                <tr class="heading">
                  <td style="white-space: nowrap;">S No</td>
                  <td style="white-space: nowrap;">Deal Name</td>
                  <td style="white-space: nowrap;">Subject</td>
                  <td style="white-space: nowrap;">Quotes Stage</td>
                  <td style="white-space: nowrap;">Quotes Owner</td>
                </tr>
                ${tableRows.join("")}
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

      setHtmlContent(invoiceHTML);
    } else {
      setHtmlContent("");
    }
  };

  const sendInvoice = async () => {
    // console.log("from is", userEmail);
    // console.log("to address is", accountData.email);
    // console.log("quotes is", htmlContent);
    // console.log("subject is", subject);

    try {
      const response = await axios.post(
        `${API_URL}sendMail`,
        {
          toMail: accountData.email,
          fromMail: userEmail,
          subject: subject,
          htmlContent: htmlContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        toast.success("Mail Send Successfully");
        handleHide();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        className="btn bg-primary bg-gradient mx-2 text-white shadow-none"
        onClick={handleShow}
      >
        Send Quotes
      </Button>

      <Offcanvas
        show={show}
        onHide={handleHide}
        className="emailHeader"
        placement="end"
      >
        <Offcanvas.Header>
          New Message &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            onClick={handleHide}
            className="btn border-dark fw-bold"
            style={{ color: "#fff", fontSize: "20px" }}
          >
            x
          </button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="d-flex align-items-center pb-3">
            <img className="img-fluid" src={user} width={40} alt="user" />
            <p style={{ marginBottom: "0px" }}>
              {userName || "--"}( {userEmail || "--"} )
            </p>
          </div>
          <div className="d-flex align-items-center py-3">
            <p className="m-0">
              <b style={{ color: "#424242" }}>To :</b>
            </p>
            <p className="m-0">{accountData.email || "--"}</p>
          </div>
          <div className="d-flex align-items-center py-3">
            <input
              type="text"
              className="form-control"
              name="subject"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              style={{ border: "none" }}
            />
          </div>

          <div className="d-flex align-items-center py-3">
            <div className="container col-12">
              {accountData && accountData.quotes ? (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="text-center bg-secondary text-white">
                      <tr>
                        <th scope="col" className="bg-secondary text-white">
                          S.No
                        </th>
                        <th scope="col" className="bg-secondary text-white">
                          Deal Name
                        </th>
                        <th scope="col" className="bg-secondary text-white">
                          Subject
                        </th>
                        <th scope="col" className="bg-secondary text-white">
                          Quote Stage
                        </th>
                        <th scope="col" className="bg-secondary text-white">
                          Quote Owner
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {accountData.quotes &&
                        accountData.quotes.map((quote, index) => (
                          <tr key={quote.id}>
                            <td>{index + 1}</td>
                            <td>{quote.dealName || "--"}</td>
                            <td>{quote.subject || "--"}</td>
                            <td>{quote.quoteStage || "--"}</td>
                            <td>{quote.quoteOwner || "--"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No quotes available.</p>
              )}
            </div>
          </div>

          <div className="d-flex align-items-end justify-content-end">
            <span className="d-flex" style={{ gap: "10px" }}>
              <button className="btn btn-primary mt-4" onClick={sendInvoice}>
                Send
                <IoMdSend className="ms-2 mb-1" />
              </button>
            </span>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SendQuotes;
