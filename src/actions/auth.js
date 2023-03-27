import api from '../utils/api';
import {setAlert} from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_LOADING,
  CLEAR_PROFILE,
  USER_UPDATING,
} from './types';

// načíst uživatele
export const loadUser = () => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/auth/user');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
// upravit uživatele
export const updateUser = (id, data, navigation) => async dispatch => {
  dispatch(startUpdating());
  try {
    const res = await api.patch('/users/' + id, data);

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });

    navigation.navigate('Home', {screen: 'Main'});
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// zaregistrovat
export const register = (formData, navigation) => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.post('/auth/register', formData);
    dispatch(
      setAlert(
        'Účet byl úspěšně zaregistrován, ověřte prosím email.',
        'success',
      ),
    );
    navigation.navigate('SignIn');
    dispatch({
      type: REGISTER_SUCCESS,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const forgotPassword = (email, navigation) => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.post('/auth/password/reset/resend', {email});
    dispatch(
      setAlert(
        'Žádost o obnovení hesla byla úspěšně odeslána, zkontrolujte si prosím email.',
        'success',
      ),
    );
    dispatch({
      type: REGISTER_SUCCESS,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
export const resetPassword = (formData, navigation) => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.post('/auth/password/reset', formData);
    dispatch(setAlert('Vaše heslo bylo úspěšně změněno', 'success'));
    navigation.navigate('SignIn');
    dispatch({
      type: REGISTER_SUCCESS,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Přihlásit
export const login = (email, password) => async dispatch => {
  dispatch(startLoading());
  const body = {email, password};

  try {
    const res = await api.post('/auth/login', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    //dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Odhlásit
export const logout = navigation => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/auth/logout');
    dispatch({type: CLEAR_PROFILE});
    dispatch({type: LOGOUT});

    navigation.closeDrawer();
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const startLoading = () => async dispatch => {
  dispatch({type: AUTH_LOADING, payload: false});
};
export const startUpdating = () => async dispatch => {
  dispatch({type: USER_UPDATING, payload: false});
};
