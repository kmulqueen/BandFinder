import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComment } from "../../actions/post";

const CommentForm = ({ addComment, postId }) => {
  const [text, setText] = useState("");

  const onSubmit = e => {
    e.preventDefault();
    addComment(postId, { text });
    setText("");
  };
  return (
    <div className="post-form">
      <div className="post-form-header bg-primary">
        <h3>Add a Comment</h3>
      </div>
      <form className="form my-1" onSubmit={e => onSubmit(e)}>
        <textarea
          cols="30"
          rows="5"
          placeholder="Add a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        ></textarea>
        <input type="submit" value="Submit" className="btn btn-dark my-1" />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired
};

export default connect(
  null,
  { addComment }
)(CommentForm);
