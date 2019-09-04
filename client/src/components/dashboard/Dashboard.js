import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  deleteAccount,
  getAllProfiles,
  getCurrentFollowInfo
} from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Followers from "./Followers";
import Following from "./Following";

const Dashboard = ({
  getCurrentProfile,
  getCurrentFollowInfo,
  getAllProfiles,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getAllProfiles();
    getCurrentFollowInfo();
  }, []);

  const [displayFollowers, toggleFollowers] = useState(false);
  const [displayFollowing, toggleFollowing] = useState(false);

  const handleFollowers = () => {
    toggleFollowers(!displayFollowers);
    toggleFollowing(false);
  };
  const handleFollowing = () => {
    toggleFollowing(!displayFollowing);
    toggleFollowers(false);
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <Fragment>
          <DashboardActions
            handleFollowers={handleFollowers}
            handleFollowing={handleFollowing}
          />
          <div className="profiles">
            <Followers
              displayFollowers={displayFollowers}
              followers={profile.followers}
            />
            <Following
              displayFollowing={displayFollowing}
              following={profile.following}
            />
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>
            You haven't set up a profile yet. Please add some information so you
            are visible to others in the community.
          </p>

          <div className="dash-buttons">
            <Link to="/create-profile" className="btn btn-light">
              <i className="fas fa-user-circle text-primary"></i> Create Profile
            </Link>
          </div>
        </Fragment>
      )}

      <div className="my-2">
        <button className="btn btn-danger" onClick={() => deleteAccount()}>
          <i className="fas fa-user-minus"></i> Delete My Account
        </button>
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentFollowInfo: PropTypes.func.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getAllProfiles,
    deleteAccount,
    getCurrentFollowInfo
  }
)(Dashboard);
