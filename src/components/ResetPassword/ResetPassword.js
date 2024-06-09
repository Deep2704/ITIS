import React, { useState } from "react";
import basestyle from "../../css/Base.module.css";
import resetstyle from "./ResetPassword.module.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { email, code } = location.state;

  const validateForm = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    axios.post("https://ec2-3-107-93-162.ap-southeast-2.compute.amazonaws.com/api/reset-password", { email, code, new_password: newPassword })
      .then((res) => {
        setMessage(res.data.message);
        navigate("/login");
      })
      .catch((error) => {
        setMessage(error.response.data.message || "Error resetting password. Please try again.");
      });
  };
  

  return (
    <div className={resetstyle.reset}>
      <form onSubmit={handlePasswordReset} className="reset-form">
        <h1>Reset Password</h1>
        <div className={resetstyle.inputContainer}>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={resetstyle.inputField}
          />
          <p className={basestyle.error}>{formErrors.newPassword}</p>
        </div>
        <div className={resetstyle.inputContainer}>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={resetstyle.inputField}
          />
          <p className={basestyle.error}>{formErrors.confirmPassword}</p>
        </div>
        <button type="submit" className={basestyle.button_common}>
          Reset Password
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default ResetPassword;
