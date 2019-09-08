import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import {
  removeComment,
  likeComment,
  removeLikeFromComment
} from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, text, name, avatar, user, date, likes },
  removeComment,
  likeComment,
  removeLikeFromComment,
  auth
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
        <p className="my-1">
          <small>
            <Moment format="MMMM DD, YYYY">{date}</Moment>
          </small>
        </p>
        <button
          className="btn btn-light"
          onClick={e => likeComment(postId, _id)}
        >
          <i className="fas fa-thumbs-up"></i>{" "}
          <span>{!likes.length ? null : likes.length}</span>
        </button>
        <button
          className="btn btn-light"
          onClick={e => removeLikeFromComment(postId, _id)}
        >
          <i className="fas fa-thumbs-down"></i>
        </button>
        {!auth.loading && user === auth.user._id && (
          <button
            onClick={e => removeComment(postId, _id)}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
  likeComment: PropTypes.func.isRequired,
  removeLikeFromComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { removeComment, likeComment, removeLikeFromComment }
)(CommentItem);
