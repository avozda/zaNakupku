import {
  GET_PROFILE,
  PROFILE_LOADING,
  PROFILE_ERROR,
  MESSAGE_LOADING,
  MESSAGE_SEND,
} from '../actions/types';

const initialState = {
  profile: null,
  error: {},
  loading: true,
};
const profile = (state = initialState, action) => {
  switch (action.type) {
    case PROFILE_LOADING:
      return {
        ...state,
        profile: null,
        loading: true,
      };
    case GET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case MESSAGE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case MESSAGE_SEND:
      return {
        ...state,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default profile;
