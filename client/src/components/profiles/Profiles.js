import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles, getCurrentProfile } from "../../actions/profile";
import ProfileItem from "./ProfileItem";

const Profiles = ({
  profile: { profile, profiles, loading },
  getAllProfiles,
  getCurrentProfile
}) => {
  useEffect(() => {
    getAllProfiles();
    getCurrentProfile();
  }, [getAllProfiles, getCurrentProfile]);

  return (
    <Fragment>
      {loading && profiles === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Community</h1>
          <p className="lead">
            <i className="fas fa-icons"></i> Connect with musicians & industry
            experts
          </p>
          <div className="profiles">
            {profiles.length && profile !== null ? (
              profiles.map(item => (
                <ProfileItem
                  key={item._id}
                  profile={item}
                  following={profile.following}
                />
              ))
            ) : (
              <h4>No profiles found</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getAllProfiles: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getAllProfiles, getCurrentProfile }
)(Profiles);
