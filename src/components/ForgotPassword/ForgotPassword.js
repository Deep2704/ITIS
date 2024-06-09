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
  const [timer, setTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
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
    axios.post("http://127.0.0.1:5000/forgot-password", { email }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setMessage(res.data.message);
        setIsCodeSent(true);
        startTimer(2 * 60); // Start a 2-minute timer
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Error sending email. Please try again.");
      });
  };

  const handleCodeVerification = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:5000/verify-reset-code", { email, code: verificationCode }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.data.success) {
          navigate("/reset-password", { state: { email, code: verificationCode } });
          clearTimer();
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Error verifying code. Please try again.");
      });
  };

  const startTimer = (duration) => {
    let time = duration;
    setRemainingTime(time);

    const timerInterval = setInterval(() => {
      time -= 1;
      setRemainingTime(time);

      if (time <= 0) {
        clearInterval(timerInterval);
        setMessage("Verification code has expired. Please request a new code.");
        setIsCodeSent(false);
      }
    }, 1000);

    setTimer(timerInterval);
  };

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  return (
    <div className={forgotstyle.forgot}>
      <form className="forgot-form">
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
            {remainingTime > 0 && <p className={forgotstyle.verificationMessage}>Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60}</p>}
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
