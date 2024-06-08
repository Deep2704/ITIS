import React, { useState } from "react";
import basestyle from "../../css/Base.module.css";
import forgotstyle from "./ForgotPassword.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!value) {
      return "Email is required";
    } else if (!regex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setFormErrors({ email: emailError });
      return;
    }
    axios.post("http://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com:5000/forgot-password", { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setMessage(res.data.message);
        setIsCodeSent(true);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Error sending email. Please try again.");
      });
  };
  
  const handleCodeVerification = (e) => {
    e.preventDefault();
    axios.post("http://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com:5000/verify-reset-code", { email, code: verificationCode }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data.success) {
          navigate("/reset-password", { state: { email, code: verificationCode } });
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Error verifying code. Please try again.");
      });
  };
  

  return (
    <div className={forgotstyle.forgot}>
      <form>
        <h1>Forgot Password</h1>
        <div className={forgotstyle.inputContainer}>
          <label>Email</label>
          <div className={forgotstyle.emailInputWrapper}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={forgotstyle.inputField}
              disabled={isCodeSent}
            />
            {!isCodeSent && (
              <a onClick={handleEmailSubmit} className={forgotstyle.verifyEmailText}>
                Verify Email
              </a>
            )}
          </div>
          <p className={basestyle.error}>{formErrors.email}</p>
        </div>
        {isCodeSent && (
          <>
            <div className={forgotstyle.inputContainer}>
              <label>Verification Code</label>
              <div className={forgotstyle.verificationCodeWrapper}>
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={forgotstyle.inputField}
                />
                <a onClick={handleCodeVerification} className={forgotstyle.verifyCodeText}>
                  Verify Code
                </a>
              </div>
            </div>
            <p>{message}</p>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
