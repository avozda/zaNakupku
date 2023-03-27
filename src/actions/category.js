import {GET_CATEGORIES, CATEGORY_ERROR} from './types';
import api from '../utils/api';
//Najít kategorie
export const getCategories = () => async dispatch => {
  try {
    const res = await api.get('/categories');

    dispatch({
      type: GET_CATEGORIES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};
