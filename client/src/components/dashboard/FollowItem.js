import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { followUser, unfollowUser } from "../../actions/profile";
import { connect } from "react-redux";

const FollowItem = ({
  name,
  avatar,
  id,
  status,
  location,
  instruments,
  following,
  followUser,
  unfollowUser
}) => {
  const isFollowing = following.filter(follow => follow.user._id === id);

  const handleFollow = e => {
    if (e.target.innerHTML === "Follow User") {
      followUser(id);
      window.location.reload();
    } else if (e.target.innerHTML === "Unfollow User") {
      unfollowUser(id);
      window.location.reload();
    }
  };

  return (
    <div className="profile bg-light">
      <img className="round-img" src={avatar} alt={`${name}`} />
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
        <Link to={`/profile/${id}`} className="btn btn-primary">
          View Profile
        </Link>

        {isFollowing.length ? (
          <Link
            className="btn btn-primary"
            to="/profiles"
            onClick={e => handleFollow(e)}
          >
            Unfollow User
          </Link>
        ) : (
          <Link
            className="btn btn-primary"
            to="/profiles"
            onClick={e => handleFollow(e)}
          >
            Follow User
          </Link>
        )}
      </div>
      <ul>
        {instruments.slice(0, 5).map((instrument, i) => (
          <li key={i} className="text-primary">
            {instrument}
          </li>
        ))}
      </ul>
    </div>
  );
};

FollowItem.propTypes = {
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { followUser, unfollowUser }
)(FollowItem);
