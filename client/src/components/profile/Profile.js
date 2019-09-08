import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { getProfileById } from "../../actions/profile";
import { getUserPosts } from "../../actions/post";
import ProfileTop from "./ProfileTop";
import ProfileAbout from "./ProfileAbout";
import UserPosts from "../posts/UserPosts";

const Profile = ({
  match,
  profile: { profile, loading },
  auth,
  post: { posts },
  getProfileById,
  getUserPosts
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
    getUserPosts(match.params.id);
  }, [getProfileById, match.params.id, getUserPosts]);

  return (
    <Fragment>
      {profile == null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to="/profiles" className="btn btn-light">
            Back to Community
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to="/edit-profile" className="btn btn-dark">
                Edit Profile
              </Link>
            )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
          </div>
          <div className="posts">
            <UserPosts posts={posts} />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getUserPosts: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  post: state.post,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProfileById, getUserPosts }
)(Profile);
