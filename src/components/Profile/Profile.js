import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ setUserState, username }) => {
  const navigate = useNavigate();

  const logout = () => {
    setUserState({});
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
