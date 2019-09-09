import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";

const PostFeed = ({ getPosts, post: { posts, loading }, following }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="medium text-primary">Feed</h1>
      <p className="lead">
        <i className="fas fa-comments"></i> Posts from profiles you follow
      </p>
      <div className="posts">
        {following.map(follow =>
          posts.map(
            post =>
              post.user === follow.user._id && (
                <PostItem key={post._id} post={post} />
              )
          )
        )}
      </div>
    </Fragment>
  );
};

PostFeed.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPosts }
)(PostFeed);
