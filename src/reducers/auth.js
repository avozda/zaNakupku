import {
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  AUTH_LOADING,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  LOGIN_FAIL,
  USER_UPDATING,
} from '../actions/types';
import {getStringAsync} from '../utils/storage';
const initialState = {
  token: null,
  isAuthenticated: null,
  loading: false,
  user: null,
  updatingUser: false,
};
getStringAsync('token').then(token => {
  initialState.token = token;

  if (!initialState.token) {
    initialState.isAuthenticated = false;
  }
});

function auth(state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true,
      };
    case USER_UPDATING:
      return {
        ...state,
        updatingUser: true,
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        updatingUser: false,
        user: payload.data,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: payload.data.user,
        token: payload.data.accessToken,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case REGISTER_SUCCESS:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        updatingUser: false,
        loading: false,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
}

export default auth;
