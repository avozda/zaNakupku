import axios from 'axios';
import {store} from '../../store';
import {LOGOUT} from '../actions/types';
import {setAlert} from '../actions/alert';
const api = axios.create({
  baseURL: 'http://creativniprojekty.cz:6969/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
let lastError = '';
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response) {
      if (err.response.data.message != null) {
        store.dispatch(setAlert(err.response.data.message, 'error'));
      }
    } else {
      if (lastError !== err.message) {
        store.dispatch(setAlert(err.message, 'error'));
      }
      lastError = err.message;
      setTimeout(() => (lastError = ''), 5000);
    }

    if (err.response.status === 401) {
      store.dispatch({type: LOGOUT});
    }
    return Promise.reject(err);
  },
);

export default api;
