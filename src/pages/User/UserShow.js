import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function UserShow() {
  const { id } = useParams();
  const [userData, setUserData] = useState({});
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();
  // console.log("id", id);

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}allUserRegistrations/${id}`,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handelEdit = () => {
    navigate(`/users/edit/${id}`);
  };

  return (
    <>
      <section className="container-fluid row section1 m-0 p-0 ">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/users">
            <button className="btn fs-4 border-white">
              <IoArrowBack className="back_arrow" />
            </button>
          </Link>
          <button
            className={`btn btn-warning ${role === "CMP_USER" && "disabled"}`}
            disabled={role === "CMP_USER" || role === "CMP_ADMIN"}
            onClick={handelEdit}
          >
            Edit
          </button>
        </div>
      </section>
      <section
        className="container-fluid row p-3 section2 m-0 p-0 d-flex justify-content-around align-items-center"
        style={{ minHeight: "90vh" }}
      >
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
              <div className="">
                <label className="text-dark Label ">User Name</label>
                <span className="text-dark ">
                  &nbsp; : &nbsp;{userData.userName || "--"}
                </span>
              </div>

              <div className="">
                <label className="text-dark Label ">Email</label>
                <span className="text-dark ">
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
                <span className="text-dark" style={{ marginLeft: "30px" }}>
                  &nbsp; : &nbsp;{userData.companyName || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Role</label>
                <span className="text-dark" style={{ marginLeft: "30px" }}>
                  &nbsp; : &nbsp;{userData.role || "--"}
                </span>
              </div>

              <div>
                <label className="text-dark Label">Appointment Role</label>
                <span className="text-dark" style={{ marginLeft: "30px" }}>
                  &nbsp; : &nbsp;{userData.appointmentRoleType || "--"}
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
            <div className="border-bottom py-3 mb-4">
              <span className="fs-6 fw-bold my-3">Address Information</span>
            </div>

            <div className="container-fluid col-md-6">
              <div className="row mb-2">
                <label className="text-dark Label col-6">Address</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{userData.address || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6">
              <div className="row">
                <label className="text-dark Label col-6">City</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{userData.city || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6">
              <div className="row">
                <label className="text-dark Label col-6">State</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{userData.state || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6">
              <div className="row">
                <label className="text-dark Label col-6">Zip Code</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{userData.zipCode || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6">
              <div className="row">
                <label className="text-dark Label col-6">Country</label>
                <span className="text-dark col-6">
                  &nbsp; : &nbsp;{userData.country || "--"}
                </span>
              </div>
            </div>
            <div className="container-fluid col-md-6"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UserShow;
