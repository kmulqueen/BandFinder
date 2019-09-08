import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { followUser, unfollowUser } from "../../actions/profile";
import { connect } from "react-redux";

const ProfileItem = ({
  profile: {
    user: { _id, name, avatar },
    status,
    instruments,
    location,
    followers
  },
  followUser,
  unfollowUser,
  auth
}) => {
  const handleFollow = e => {
    console.log(e.target.innerHTML);
    if (e.target.innerHTML === "Follow User") {
      followUser(_id);
      window.location.reload();
    } else if (e.target.innerHTML === "Unfollow User") {
      unfollowUser(_id);
      window.location.reload();
    }
  };
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
        {followers.length ? (
          followers.map(
            (follow, i) =>
              follow.user === auth.user._id && (
                <Link
                  to="/profiles"
                  className="btn btn-primary"
                  type="button"
                  onClick={e => handleFollow(e)}
                  key={i}
                >
                  Unfollow User
                </Link>
              )
          )
        ) : (
          <Link
            to="/profiles"
            className="btn btn-primary"
            type="button"
            onClick={e => handleFollow(e)}
          >
            Follow User
          </Link>
        )}
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
  profile: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { followUser, unfollowUser }
)(ProfileItem);
