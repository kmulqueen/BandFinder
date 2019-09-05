import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileTop = ({
  profile: {
    status,
    location,
    social,
    website,
    user: { name, avatar }
  }
}) => {
  return (
    <div className="profile-top bg-primary p-2">
      <img className="round-img my-1" src={avatar} alt={name} />
      <h1 className="large">{name}</h1>
      <p className="lead">
        {status.map((item, i) =>
          i + 1 !== status.length ? (
            <Fragment key={i}>
              {item}
              {", "}
            </Fragment>
          ) : (
            <Fragment key={i}>{item}</Fragment>
          )
        )}
      </p>
      <p>{location}</p>
      <div className="icons my-1">
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer">
            <i className="fas fa-globe fa-2x"></i>
          </a>
        )}

        {social && social.twitter && (
          <a href={social.twitter} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter fa-2x"></i>
          </a>
        )}

        {social && social.facebook && (
          <a href={social.facebook} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook fa-2x"></i>
          </a>
        )}

        {social && social.instagram && (
          <a href={social.instagram} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram fa-2x"></i>
          </a>
        )}

        {social && social.spotify && (
          <a href={social.spotify} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-spotify fa-2x"></i>
          </a>
        )}

        {social && social.soundcloud && (
          <a href={social.soundcloud} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-soundcloud fa-2x"></i>
          </a>
        )}

        {social && social.itunes && (
          <a href={social.itunes} target="_blank" rel="noopener noreferrer">
            <i className="fab fa-itunes fa-2x"></i>
          </a>
        )}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileTop;
