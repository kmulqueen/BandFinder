import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles, getCurrentProfile } from "../../actions/profile";
import ProfileItem from "./ProfileItem";
import SearchBar from "./SearchBar";

const Profiles = ({
  profile: { profile, profiles, loading },
  getAllProfiles,
  getCurrentProfile
}) => {
  useEffect(() => {
    getAllProfiles();
    getCurrentProfile();
  }, [getAllProfiles, getCurrentProfile]);

  const [displaySearchBar, toggleSearchBar] = useState(false);

  const showSearchBar = () => {
    toggleSearchBar(!displaySearchBar);
  };

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
            <button
              className="btn btn-dark my-1"
              type="button"
              onClick={showSearchBar}
            >
              Filter Profiles
            </button>
            {displaySearchBar ? <SearchBar /> : null}

            {profiles.length && profile !== null ? (
              profiles.map(item => (
                <ProfileItem
                  key={item._id}
                  profile={item}
                  following={profile.following}
                />
              ))
            ) : (
              <Spinner />
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
