import React, { useState, useEffect } from "react";
import basestyle from "../../css/Base.module.css";
import loginstyle from "./Login.module.css";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
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
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  const loginHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios.post("http://3.27.222.116/login", user).then((res) => {
        if (res.data.success) {
          setUserState(res.data.user);
          navigate("/", { replace: true });
        } else {
          alert(res.data.message || "Login failed");
        }
      }).catch((error) => {
        alert("Error: " + error.message);
      });
    }
  }, [formErrors, isSubmit, navigate, setUserState, user]);

  const handleGoogleSuccess = (response) => {
    console.log(response);
    // Handle successful Google login here
  };

  const handleGoogleFailure = (error) => {
    console.error(error);
    // Handle Google login failure here
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className={loginstyle.login}>
        <form>
          <button className={loginstyle["close-button"]}>×</button>
          <h1>Login</h1>
          <div className={loginstyle.inputContainer}>
            <label>Username</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Username or Email"
              onChange={changeHandler}
              value={user.email}
              className={loginstyle.inputField}
            />
            <p className={basestyle.error}>{formErrors.email}</p>
          </div>
          <div className={loginstyle.inputContainer}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={changeHandler}
              value={user.password}
              className={loginstyle.inputField}
            />
            <p className={basestyle.error}>{formErrors.password}</p>
          </div>
          <div className={loginstyle["remember-me"]}>
            <input type="checkbox" id="rememberMe" name="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <button className={`${basestyle.button_common} ${loginstyle.loginButton}`} onClick={loginHandler}>
            Login
          </button>
          <NavLink to="/forgot-password" className={loginstyle.forgotPassword}>
            Forgot password?
          </NavLink>

          <div className={loginstyle.newUser}>
            <span>New user?</span>
            <NavLink to="/signup" className={loginstyle.signupButton}>
              Signup Now
            </NavLink>
          </div>
          <div className={loginstyle.oauth}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
