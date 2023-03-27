import api from '../utils/api';
import {
  GET_CHECKOUT,
  CHECKOUT_ERROR,
  CHECKOUT_SUCCESS,
  CHECKOUT_LOADING,
  START_LOADING,
} from './types';
import {setAlert} from './alert';

//Najít produkt podle id
export const getCheckout = id => async dispatch => {
  try {
    dispatch(startLoading(START_LOADING));
    const res = await api.get('/listings/' + id);

    dispatch({
      type: GET_CHECKOUT,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: CHECKOUT_ERROR,
      payload: error,
    });
  }
};

export const completeCheckout = (cardInfo, navigation) => async dispatch => {
  try {
    dispatch(startLoading(CHECKOUT_LOADING));
    const res = await api.post('/payments/checkout', cardInfo);

    dispatch({
      type: CHECKOUT_SUCCESS,
    });

    dispatch(setAlert('Položka byla úspěšně zaplacena', 'success'));
    navigation.navigate('MyBidsPage');
  } catch (error) {
    dispatch({
      type: CHECKOUT_ERROR,
      payload: error,
    });
  }
};

export const startLoading = type => async dispatch => {
  dispatch({type: type, payload: false});
};
