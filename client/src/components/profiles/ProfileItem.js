import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    instruments,
    location
  }
}) => {
  return (
    <div className="profile bg-light">
      <img src={avatar} alt={`${name}`} className="round-img" />
      <div>
        <h2>{name}</h2>
        <div>
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
        </div>
        <p className="my-1">{location}</p>
        <Link to={`/profile/${_id}`} className="btn btn-primary">
          View Profile
        </Link>
      </div>
      <ul>
        {instruments.map((instrument, i) => (
          <li key={i} className="text-primary">
            {instrument}
          </li>
        ))}
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
