import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  GET_PROFILES,
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_ERROR,
  DELETE_ACCOUNT,
  CLEAR_PROFILE,
  GET_CURRENT_FOLLOW_INFO
} from "./types";

// Get Current User Profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Create/Update Profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" }
    };

    const res = await axios.post("/api/profile", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(
      setAlert(edit ? "Profile Updated." : "Profile Created", "success")
    );

    history.push("/dashboard");
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get All Profiles
export const getAllProfiles = () => async dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get Profile by ID
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get Current User's Followers & Following
// (ONLY REASON I'M DOING THIS IS TO GET THE UPDATED FOLLOWER/FOLLOWING INFO IF THAT USER HAS UPDATED THEIR INFO)
// (THE FOLLOWER/FOLLOWING IN THE DATABASE IS LOCKED IN AT THE MOMENT THE USER FOLLOWS THEM, SO ANY UPDATES LIKE STATUS, LOCATION, ETC. WILL NOT SHOW UP UNLESS I DO THIS)
export const getCurrentFollowInfo = () => async dispatch => {
  try {
    // Get all profiles
    const res1 = await axios.get("api/profile");
    const allProfiles = res1.data;
    // Get user's profile
    const res2 = await axios.get("/api/profile/me");
    const userProfile = res2.data;
    const userFollowers = userProfile.followers;
    const userFollowing = userProfile.following;
    // Create array to store followers & following
    let updatedFollowers = [];
    let updatedFollowing = [];
    // Compare profile users ids to user's followers
    userFollowers.map(follower => {
      allProfiles.map(item => {
        if (follower.user === item.user._id) {
          updatedFollowers.unshift(item);
        }
      });
    });
    // Compare profile users ids to user's following
    userFollowing.map(follow => {
      allProfiles.map(item => {
        if (follow.user === item.user._id) {
          updatedFollowing.unshift(item);
        }
      });
    });

    // Update followers
    userProfile.followers = updatedFollowers;
    userProfile.following = updatedFollowing;

    dispatch({
      type: GET_CURRENT_FOLLOW_INFO,
      payload: userProfile
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Follow User
export const followUser = userId => async dispatch => {
  try {
    const res = await axios.put(`/api/profile/follow/${userId}`);

    dispatch({
      type: FOLLOW_USER,
      payload: res.data
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Unfollow User
export const unfollowUser = userId => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/follow/${userId}`);

    dispatch({
      type: UNFOLLOW_USER,
      payload: res.data
    });
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
// Delete Account & Profile
export const deleteAccount = () => async dispatch => {
  if (
    window.confirm(
      "Are you sure you want to delete your account? This action can NOT be undone."
    )
  ) {
    try {
      const res = await axios.delete("/api/profile");

      dispatch({
        type: CLEAR_PROFILE
      });

      dispatch({
        type: DELETE_ACCOUNT
      });

      dispatch(setAlert("Your account has been deleted."));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status
        }
      });
    }
  }
};
