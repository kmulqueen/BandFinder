import React from "react";
import FollowItem from "./FollowItem";
import PropTypes from "prop-types";

const Followers = ({ displayFollowers, followers, following }) => {
  return (
    <div className="profiles">
      {displayFollowers && followers.length ? (
        followers.map(follower => (
          <FollowItem
            key={follower.user._id}
            id={follower.user._id}
            name={follower.user.name}
            avatar={follower.user.avatar}
            instruments={follower.instruments}
            status={follower.status}
            location={follower.location}
            following={following}
          />
        ))
      ) : displayFollowers && !followers.length ? (
        <h4>No followers found.</h4>
      ) : null}
    </div>
  );
};

Followers.propTypes = {
  displayFollowers: PropTypes.bool,
  followers: PropTypes.array
};

export default Followers;
