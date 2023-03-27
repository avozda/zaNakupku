import {GET_CATEGORIES, CATEGORY_ERROR} from '../actions/types';

const initialState = {
  categories: [],
  category: null,
  loading: true,
  error: {},
};
const category = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };
    case CATEGORY_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default category;
