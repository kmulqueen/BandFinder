import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  deleteAccount,
  getCurrentFollowInfo
} from "../../actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";
import Followers from "./Followers";
import Following from "./Following";
import PostFeed from "./PostFeed";

const Dashboard = ({
  getCurrentProfile,
  getCurrentFollowInfo,
  deleteAccount,
  auth: { user },
  profile: { profile, loading }
}) => {
  useEffect(() => {
    getCurrentProfile();
    getCurrentFollowInfo();
  }, [getCurrentProfile, getCurrentFollowInfo]);

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
              following={profile.following}
            />
            <Following
              displayFollowing={displayFollowing}
              following={profile.following}
            />
          </div>
          <div className="posts">
            {profile.following.length ? (
              <PostFeed following={profile.following} />
            ) : (
              <Fragment>
                <h4 className="text-primary">Feed</h4>
                <p>
                  <i className="fas fa-comments"></i> Follow other users to see
                  their posts in your feed
                </p>
              </Fragment>
            )}
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
        <h1 className="medium text-primary">Account Actions</h1>
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

    deleteAccount,
    getCurrentFollowInfo
  }
)(Dashboard);
