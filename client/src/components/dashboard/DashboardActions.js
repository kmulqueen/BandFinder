import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = () => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-edit text-primary"></i> Edit Profile{" "}
      </Link>
      <Link to="/followers" className="btn btn-light">
        <i className="fas fa-users text-primary"></i> Followers{" "}
      </Link>
      <Link to="/following" className="btn btn-light">
        <i className="fas fa-user-friends text-primary"></i> Following{" "}
      </Link>
    </div>
  );
};

export default DashboardActions;
