import api from '../utils/api';
import {
  GET_PROFILE,
  PROFILE_ERROR,
  PROFILE_LOADING,
  MESSAGE_LOADING,
  MESSAGE_SEND,
} from './types';
import {setAlert} from './alert';

//Najít profil podle id
export const getProfile = id => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/users/' + id);
    console.log(res);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};

export const addReview = (formData, navigation) => async dispatch => {
  try {
    dispatch(startLoading());
    const res = await api.post('/reviews', formData);

    dispatch(setAlert('Vaše recenze byla úspěšně odeslána', 'success'));

    dispatch({type: GET_PROFILE});

    navigation.navigate('MyBids', {screen: 'MyBidsPage'});
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: error,
    });
  }
};
export const sendMessage = (formData, navigation, id) => async dispatch => {
  dispatch(messageLoading());
  try {
    const res = await api.post('/auth/message/send', formData);

    dispatch(setAlert('Vaše zpráva byla úspěšně odeslána', 'success'));

    dispatch({type: MESSAGE_SEND});

    navigation.navigate('Home', {screen: 'SellerProfile', params: {id}});
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: error,
    });
  }
};

export const startLoading = () => async dispatch => {
  dispatch({type: PROFILE_LOADING, payload: false});
};
export const messageLoading = () => async dispatch => {
  dispatch({type: MESSAGE_LOADING, payload: false});
};
