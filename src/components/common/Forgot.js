import { Link, useNavigate } from "react-router-dom";
import CRM from "../../assets/heroImage.png";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../Config/URL";
import { toast } from "react-toastify";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form'


const schema = yup.object().shape({
  email: yup.string().email("!Please Enter valid email").required("!Enter the Email"),
});

const RadioFormSelector = () => {
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const handelForgot = async () => {
    try {
      const response = await axios.get(
        `${API_URL}userForgotPassword`,
        { params: { email: Email } },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Password send to mail");
        navigate('/login')
      } else {
        toast.error("Unsuccess");
      }
    } catch (error) {
      toast.error("Failed: " + error.message);
    }
    console.log("Api Data:",Email);
  };

  return (
    <div style={{ marginTop: "105px" }}>
      <div className="container">
        <div className="row py-5">
          <div className="col-md-6 col-12 heroImageBackground">
            <img className="img-fluid" src={CRM} alt="CRMLAH" />
          </div>
          <div className="col-md-6 col-12 d-flex flex-column align-items-center justify-content-center">
            <h3 className="registerWord">FORGOT PASSWORD</h3>
            <div className="card my-3" style={{ width: "25rem" }}>
              <div className="card-body">
                <form>
                  <div className="form-group my-2">
                    <label htmlFor="companyId" className="mb-1">
                      User Email:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="companyId"
                      {...register('email')}
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter User Email"
                    />
                    <p className='text-danger'>{errors.email?.message}</p>
                  </div>
                  <button
                    className="contactsubmitBtn btn btn-primary mt-3"
                    type="button"
                    // onClick={handelForgot}
                    onClick={handleSubmit(()=> {
                      handelForgot()
                    })}
                    style={{ width: "100%" }}
                  >
                    Submit
                  </button>
                  <p className="forgotWord text-center mt-2">
                    Return to{" "}
                    <Link to="/forgot" className="password-link">
                      Login
                    </Link>
                    ?
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioFormSelector;
