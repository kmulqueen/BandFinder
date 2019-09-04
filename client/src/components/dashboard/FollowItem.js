import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const FollowItem = ({ name, avatar, id, status, location, instruments }) => {
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

export default FollowItem;
