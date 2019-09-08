import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { addLike, removeLike, deletePost } from "../../actions/post";

const PostItem = ({
  auth,
  post: { _id, text, name, avatar, user, likes, comments, date },
  addLike,
  removeLike,
  deletePost,
  showActions
}) => {
  return (
    <div className="post bg-white my-2 p-2">
      <div>
        <Link to={`/profile/${user}`}>
          <img className="round-img my-2" src={avatar} alt={name} />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-2">{text}</p>
        <p>
          <small>
            <Moment format="MMMM DD, YYYY">{date}</Moment>
          </small>
        </p>
        {showActions && (
          <Fragment>
            <button
              className="btn btn-light"
              type="button"
              onClick={e => addLike(_id)}
            >
              <i className="fas fa-thumbs-up"></i>{" "}
              <span>{!likes.length ? null : likes.length}</span>
            </button>
            <button
              className="btn btn-light"
              type="button"
              onClick={e => removeLike(_id)}
            >
              <i className="fas fa-thumbs-down"></i>
            </button>
            <Link to={`/post/${_id}`} className="btn btn-primary">
              Comments {!comments.length ? null : `(${comments.length})`}
            </Link>
          </Fragment>
        )}
        {!auth.loading && user === auth.user._id && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={e => deletePost(_id)}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.defaultProps = {
  showActions: true
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
