import api from './api';
import {setStringAsync} from './storage';
import {deleteStringAsync} from './storage';
const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    setStringAsync('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    deleteStringAsync('token');
  }
};

export default setAuthToken;
