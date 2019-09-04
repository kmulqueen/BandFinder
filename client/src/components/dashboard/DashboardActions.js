import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DashboardActions = ({ handleFollowers, handleFollowing }) => {
  return (
    <div className="dash-buttons my-2">
      <Link to="/edit-profile" className="btn btn-light">
        <i className="fas fa-user-edit text-primary"></i> Edit Profile{" "}
      </Link>
      <Link className="btn btn-light" to="/dashboard" onClick={handleFollowers}>
        <i className="fas fa-users text-primary"></i> Followers{" "}
      </Link>
      <Link className="btn btn-light" to="/dashboard" onClick={handleFollowing}>
        <i className="fas fa-user-friends text-primary"></i> Following{" "}
      </Link>
    </div>
  );
};

DashboardActions.propTypes = {
  handleFollowers: PropTypes.func,
  handleFollowing: PropTypes.func
};

export default DashboardActions;
