import {
  GET_CHECKOUT,
  CHECKOUT_ERROR,
  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  START_LOADING,
} from '../actions/types';

const initialState = {
  product: {},
  loading: true,
  checkoutLoading: false,
  error: {},
};
const checkout = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHECKOUT:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        checkoutLoading: false,
      };
    case CHECKOUT_LOADING:
      return {
        ...state,
        checkoutLoading: true,
      };
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case CHECKOUT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        checkoutLoading: false,
      };
    default:
      return state;
  }
};

export default checkout;
