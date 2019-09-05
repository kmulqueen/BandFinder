import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    instruments,
    projects,
    albums,
    user: { name }
  }
}) => {
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">Bio</h2>
          <p>{bio}</p>
          <div className="line"></div>
        </Fragment>
      )}
      <h2 className="text-primary">Instruments</h2>
      <div className="instruments">
        {instruments.map((instrument, i) => (
          <div className="p-1" key={i}>
            {instrument}
          </div>
        ))}
      </div>
      <div className="line"></div>

      {projects && (
        <Fragment>
          <h2 className="text-primary">Bands</h2>
          <div className="instruments">
            {projects.map((project, i) => (
              <div className="p-1" key={i}>
                {project}
              </div>
            ))}
          </div>
          <div className="line"></div>
        </Fragment>
      )}

      {albums && (
        <Fragment>
          <h2 className="text-primary">Albums</h2>
          <div className="instruments">
            {albums.map((album, i) => (
              <div className="p-1" key={i}>
                {album}
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;
