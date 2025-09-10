import React from "react";

const HomePage = ({ user, onLogout }) => {
  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <img src={user.picture} alt="User profile" />
      <p>Email: {user.email}</p>
      <p>ID: {user.id}</p>
      <button onClick={onLogout}>Log Out</button>
    </div>
  );
};

export default HomePage;
