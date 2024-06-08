import React, { useState, useEffect } from "react";
import basestyle from "../../css/Base.module.css";
import registerstyle from "./Register.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [user, setUserDetails] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+\@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };

  const sendVerificationEmail = async () => {
    try {
      console.log('sendVerificationEmail called');
      const response = await axios.post("http://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com:5000/send-verification-email", { email: user.email });
      console.log(response.data);
      setVerificationMessage("Verification email sent. Please check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setVerificationMessage("Error sending verification email. Please try again.");
    }
  };
  
  const verifyEmailCode = async () => {
    try {
      const response = await axios.post("http://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com:5000/verify-email-code", { email: user.email, code: verificationCode });
      if (response.data.success) {
        setIsEmailVerified(true);
        setVerificationMessage("Email verified successfully.");
      } else {
        setVerificationMessage("Invalid verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setVerificationMessage("Error verifying code. Please try again.");
    }
  };
  
  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };
  
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit && isEmailVerified) {
      axios.post("http://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com:5000/signup", user)
        .then((res) => {
          alert(res.data.message);
          navigate("/login", { replace: true });
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    } else if (!isEmailVerified) {
      setVerificationMessage("Please verify your email before signing up.");
    }
  }, [formErrors, isSubmit, isEmailVerified, navigate, user]);
  

  return (
    <div className={registerstyle.register}>
      <form>
        <h1>Create your account</h1>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>First Name</label>
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            onChange={changeHandler}
            value={user.fname}
            className={registerstyle.registerInputField}
          />
          <p className={basestyle.error}>{formErrors.fname}</p>
        </div>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>Last Name</label>
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            onChange={changeHandler}
            value={user.lname}
            className={registerstyle.registerInputField}
          />
          <p className={basestyle.error}>{formErrors.lname}</p>
        </div>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>Email</label>
          <div className={registerstyle.emailInputWrapper}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={changeHandler}
              value={user.email}
              className={registerstyle.registerInputField}
            />
            <a onClick={sendVerificationEmail} className={registerstyle.verifyEmailText}>Verify Email</a>
          </div>
          <p className={basestyle.error}>{formErrors.email}</p>
        </div>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>Verification Code</label>
          <div className={registerstyle.verificationCodeWrapper}>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter Verification Code"
              onChange={(e) => setVerificationCode(e.target.value)}
              className={registerstyle.registerInputField}
            />
            <a onClick={verifyEmailCode} className={registerstyle.verifyCodeText}>Verify Code</a>
          </div>
          <p className={registerstyle.verificationMessage}>{verificationMessage}</p>
        </div>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={changeHandler}
            value={user.password}
            className={registerstyle.registerInputField}
          />
          <p className={basestyle.error}>{formErrors.password}</p>
        </div>
        <div className={registerstyle.registerInputContainer}>
          <label className={registerstyle.registerLabel}>Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
            className={registerstyle.registerInputField}
          />
          <p className={basestyle.error}>{formErrors.cpassword}</p>
        </div>
        <button
          className={`${basestyle.button_common} ${registerstyle.registerButton}`}
          onClick={signupHandler}
          disabled={!isEmailVerified}
        >
          Register
        </button>
        <div className={registerstyle.newUser}>
          <span>Already registered?</span>
          <NavLink to="/login" className={registerstyle.signupButton}>
            Login Now
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Register;
