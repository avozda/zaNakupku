import {
  SEARCH_GLOBAL,
  GLOBAL_SEARCH_ERROR,
  SET_GLOBAL_SEARCH_LOADING,
  RESET_SEARCH,
} from '../actions/types';

const initialState = {
  categories: [],
  listings: [],
  loading: true,
  error: {},
};
const globalSearch = (state = initialState, action) => {
  switch (action.type) {
    case RESET_SEARCH:
      return initialState;
    case SEARCH_GLOBAL:
      return {
        ...state,
        categories: action.payload.data.categories,
        listings: action.payload.data.listings,
        loading: false,
      };
    case GLOBAL_SEARCH_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default globalSearch;
