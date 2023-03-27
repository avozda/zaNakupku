import api from '../utils/api';
import {FEATURED_ERROR, GET_FEATURED} from './types';

export const getFeatured = maxPrice => async dispatch => {
  try {
    const res = await api.get('/mainpage/' + maxPrice);
    dispatch({
      type: GET_FEATURED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FEATURED_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};
