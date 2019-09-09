import React, { Fragment } from "react";
import PropTypes from "prop-types";
import FollowItem from "./FollowItem";
import ProfileItem from "../profiles/ProfileItem";

const Following = ({ displayFollowing, following }) => {
  return (
    <Fragment>
      <div className="profiles">
        {displayFollowing && following.length ? (
          following.map(follow => (
            <FollowItem
              key={follow.user._id}
              id={follow.user._id}
              name={follow.user.name}
              avatar={follow.user.avatar}
              instruments={follow.instruments}
              status={follow.status}
              location={follow.location}
              following={following}
            />
          ))
        ) : displayFollowing && !following.length ? (
          <h4>You are not following anyone.</h4>
        ) : null}
      </div>
    </Fragment>
  );
};

Following.propTypes = {
  displayFollowing: PropTypes.bool,
  following: PropTypes.array
};

export default Following;
