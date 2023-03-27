import {FEATURED_ERROR, GET_FEATURED} from '../actions/types';

const initialState = {
  randomCategory: [],
  soonEnding: [],
  upToMaxPrice: [],
  loading: true,
  error: {},
};
const featured = (state = initialState, action) => {
  switch (action.type) {
    case GET_FEATURED:
      return {
        ...state,
        randomCategory: action.payload.data.randomCategory,
        soonEnding: action.payload.data.soonEnding,
        upToMaxPrice: action.payload.data.upToMaxPrice,
        loading: false,
      };
    case FEATURED_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default featured;
