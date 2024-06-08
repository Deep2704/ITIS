import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Welcome from "./components/Welcome/Welcome";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthProvider, { useAuth } from './components/AuthContext/AuthContext';

function App() {
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    console.log("Current user state in App:", userState);
  }, [userState]);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <Router>
          <AuthProvider>
            <Routes>
              <Route
                path="/"
                element={
                  userState && userState.id ? (
                    <Welcome user={userState} setUserState={setUserState} />
                  ) : (
                    <Login setUserState={setUserState} />
                  )
                }
              />
              <Route path="/login" element={<Login setUserState={setUserState} />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/welcome" element={<Welcome user={userState} setUserState={setUserState} />} />
            </Routes>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
