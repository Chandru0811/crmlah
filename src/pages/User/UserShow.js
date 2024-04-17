import React, { useEffect, useState } from "react";
import { Tooltip, Zoom, responsiveFontSizes } from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import UserEdit from "../User/UserEdit";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function UserShow() {
  const { id } = useParams;
  const [userData, setUserData] = useState({});

  console.log("id", id);

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}allUserRegistrations/${8}`,
          {
            headers: {
              "Content-Type": "application/json",
              //Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
        console.log("userData", userData);
      } catch (error) {
        toast.error("Error fetching data:", error);
      }
    };

    userData();
  }, []);

  return (
    <>
      <section className="container-fluid row section1 m-0 p-0">
        <div className="col-9 mt-1">
          {/* <UserEdit id={id} name="Edit " /> */}
          <Link to="/users">
            <IoArrowBack />
          </Link>
        </div>
      </section>
      <section className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center">
        {/* Right Side Content */}
        <div
          className="container-fluid col-md-9 m-0"
          id="userDetails-container"
        >
          {/*User Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">User Information</span>
            </div>

            <div className="container-fluid col-md-6 mt-4">
              <div>
                <label className="text-dark Label">User Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.userName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Email</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.email || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Password</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.password || "--"}
                </span>
              </div> */}
              <div>
                <label className="text-dark Label">Phone</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.phone || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6 mt-4">
              <div>
                <label className="text-dark Label">Company Name</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.companyName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Role</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.role || "--"}
                </span>
              </div>

              {/* <div>
                <label className="text-dark Label">Confrim Password</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.cpassword || "--"}
                </span>
              </div> */}
            </div>

            <div className="container-fluid col-md-6"></div>
          </div>

          {/* Hide Details */}
          <div className="container-fluid row" id="Details">
            <div className="border-bottom py-3">
              <span className="fs-6 fw-bold my-3">Address Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">Address</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.address || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">State</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.state || "--"}
                </span>
              </div>
              <div>
                <label className="text-dark Label">Country</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.country || "--"}
                </span>
              </div>
            </div>

            <div className="container-fluid col-md-6">
              <div>
                <label className="text-dark Label">City</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.city || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Zip Code</label>
                <span className="text-dark">
                  &nbsp; : &nbsp;{userData.zipCode || "--"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserShow;
