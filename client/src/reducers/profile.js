import {
  GET_PROFILE,
  GET_PROFILES,
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  GET_CURRENT_FOLLOW_INFO
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case GET_CURRENT_FOLLOW_INFO:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      state.profiles.map(profile => {
        if (profile.user._id === payload.userId) {
          profile.followers = payload.followers.followers;
        }
      });
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}
