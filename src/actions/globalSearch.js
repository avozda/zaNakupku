import api from '../utils/api';
import {
  GLOBAL_SEARCH_ERROR,
  SEARCH_GLOBAL,
  SET_GLOBAL_SEARCH_LOADING,
  RESET_SEARCH,
} from './types';

//Globální vyhledávání
export const globalSearch = search => async dispatch => {
  try {
    const res = await api.get('/search/' + search);
    dispatch({
      type: SEARCH_GLOBAL,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GLOBAL_SEARCH_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};

export const resetSearch = () => async dispatch => {
  dispatch({
    type: RESET_SEARCH,
  });
};
