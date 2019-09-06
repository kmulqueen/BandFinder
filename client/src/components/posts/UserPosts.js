import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import PostItem from "../posts/PostItem";

const UserPosts = ({ posts }) => {
  return (
    <Fragment>
      {posts.map(post => (
        <PostItem key={post._id} post={post} />
      ))}
    </Fragment>
  );
};

UserPosts.propTypes = {
  posts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  posts: state.post.posts
});

export default connect(
  mapStateToProps,
  {}
)(UserPosts);
