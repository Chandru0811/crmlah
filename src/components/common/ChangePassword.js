import React, { useState } from "react";
import CRM from "../../assets/heroImage.png";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form'

const schema = yup.object().shape({
  userName: yup.string().required("!please enter the UserName"),
  // password: yup.string().required("!Enter the valid Password").min(4, "!min length of 4 chars").matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
  //   'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  // ).max(10, "!Enter upto 15 chars only"),

  oldPassword: yup.string().required("!Enter the Old Password").min(4, "!min length of 4 chars").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  ).max(10, "!Enter upto 15 chars only"),

  newPassword: yup.string().required("!Enter the New Password").min(4, "!min length of 4 chars").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  ).max(10, "!Enter upto 15 chars only"),

  confirmPassword: yup.string().required("!Enter the Confirm Password").min(4, "!min length of 4 chars").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
  ).max(10, "!Enter upto 15 chars only"),
});

function ChangePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCPassword, setShowCPasword] =useState(false);
  const token = sessionStorage.getItem("token");   
  const role = sessionStorage.getItem('role');

  const navigate = useNavigate();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowOldPassword) => !prevShowOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPasword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const  handleChangePassword = async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}changeUserPassword`,data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
  };

  return (
    <section className="signIn">
      <div>
        <div className="container">
          <div className="row py-5">
            <div className="col-md-6 col-12 heroImageBackground d-flex align-items-center justify-content-center">
              <img className="img-fluid" src={CRM} alt="CRMLAH" />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <h3 className="registerWord text-center">Change Password</h3>
              <form onSubmit={handleSubmit(handleChangePassword)}>

                <div className="form-group mt-3">
                  <label>User Name:</label>
                  <input
                   {...register('userName')}
                    type="text"
                    className="form-control"
                    name="userName"
                    id="userName"
                  />
                   <p className='text-danger'>{errors.userName?.message}</p>
                </div>

                <div className="form-group mt-3">
                    <label className="form-label">Old Password:</label>
                    <div className="input-group">
                      <input {...register('oldPassword')}
                        type={showOldPassword ? "text" : "password"}
                        className="form-control" id="oldPassword"
                        style={{ margin: "0px"  }}
                      />
                      <span className="input-group-append eye-icon" 
                      onClick={toggleOldPasswordVisibility}>
                        {showOldPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                      <p className='text-danger'>{errors.oldPassword?.message}</p>   
                </div>

                <div className="form-group mt-3">
                    <label className="form-label">New Password:</label>
                    <div className="input-group">
                      <input {...register('newPassword')}
                        type={showNewPassword ? "text" : "password"}
                        className="form-control" id="newPassword"
                        style={{ margin: "0px"  }}
                      />
                        <span className="input-group-append eye-icon"  
                        onClick={toggleNewPasswordVisibility}>
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                      <p className='text-danger'>{errors.newPassword?.message}</p>   
                </div>

                <div className="form-group mt-3">
                    <label className="form-label">Confirm Password:</label>
                    <div className="input-group">
                      <input {...register('confirmPassword')}
                        type={showCPassword ? "text" : "password"}
                        className="form-control" id="confirmPassword"
                        style={{ margin: "0px"  }}
                      />
                          <span className="input-group-append eye-icon" 
                      onClick={toggleCPasswordVisibility}>
                        {showCPassword ? <FaEyeSlash /> : <FaEye />}</span>
                    </div>
                      <p className='text-danger'>{errors.confirmPassword?.message}</p>   
                </div>

                <button
                  className="contactsubmitBtn btn btn-primary mt-3"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Change Password
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChangePassword;
