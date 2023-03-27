import {
  ADD_PRODUCT_TO_FAVOURITE,
  REMOVE_PRODUCT_FROM_FAVOURITE,
  PRODUCT_FAVOURITE_ERROR,
  GET_PRODUCT,
  GET_PRODUCTS,
  PRODUCT_ERROR,
  PRODUCT_LOADING,
  FAVOURITES_LOADED,
  PRODUCT_UPDATE,
  PRODUCT_CREATE,
} from '../actions/types';

const initialState = {
  products: [],
  favourites: null,
  product: {},
  loading: true,
  error: null,
  favouriteError: false,
};
const product = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LOADING:
      return {
        ...state,
        product: {},
        products: [],
        favourites: null,
        loading: true,
      };
    case PRODUCT_CREATE:
      return {
        ...state,
        loading: false,
      };
    case GET_PRODUCT:
      return {
        ...state,
        product: action.payload,
        loading: false,
      };
    case PRODUCT_UPDATE:
      return {
        ...state,
        product: {
          ...state.product,
          data: {
            ...state.product.data,
            price: action.payload.price ?? state.product.data.price,
            ending: action.payload.date ?? state.product.data.ending,
            winningUserId: action.payload.user
              ? action.payload.user.id
              : state.product.data.winningUserId,
          },
        },
        loading: false,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload.data,
        loading: false,
      };
    case ADD_PRODUCT_TO_FAVOURITE:
      return {
        ...state,
        favouriteError: false,
        product: product
          ? {data: {...state.product.data, isFavourite: true}}
          : null,
        loading: false,
      };
    case FAVOURITES_LOADED:
      return {
        ...state,
        favourites: action.payload.data,
        loading: false,
      };
    case REMOVE_PRODUCT_FROM_FAVOURITE:
      return {
        ...state,
        favouriteError: false,
        product: product
          ? {data: {...state.product.data, isFavourite: false}}
          : null,
        loading: false,
      };
    case PRODUCT_FAVOURITE_ERROR:
      return {
        ...state,
        favouriteError: true,
      };
    case PRODUCT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default product;
