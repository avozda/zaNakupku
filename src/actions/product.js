import api from '../utils/api';
import {
  ADD_PRODUCT_TO_FAVOURITE,
  GET_PRODUCT,
  GET_PRODUCTS,
  PRODUCT_ERROR,
  PRODUCT_FAVOURITE_ERROR,
  PRODUCT_LOADING,
  REMOVE_PRODUCT_FROM_FAVOURITE,
  FAVOURITES_LOADED,
  PRODUCT_UPDATE,
  PRODUCT_CREATE,
  BID_LOADING,
} from './types';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {setAlert} from './alert';

let PusherClient = new Pusher('zanakupkuKEY', {
  cluster: 'mt1',
  wsHost: 'creativniprojekty.cz',
  wsPort: '6001',
  enabledTransports: ['ws', 'wss'],
  forceTLS: false,
  encrypted: false,
  disableStats: true,
});
let echo = new Echo({
  broadcaster: 'pusher',
  client: PusherClient,
});

//Najít produkt podle id
export const getProduct = id => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/listings/' + id);

    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};

//přidate nabídku
export const addListing = (formData, navigation) => async dispatch => {
  try {
    dispatch(startLoading());
    const res = await api.post('/listings', formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    dispatch(setAlert('Vaše aukce byla úspěšně vytvořena', 'success'));

    dispatch({type: PRODUCT_CREATE});

    navigation.navigate('MyListings', {screen: 'MyListingsPage'});
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: error,
    });
  }
};

//přihodit
export const addBid = formData => async dispatch => {
  dispatch(startBidLoading());
  try {
    const res = await api.post('/payments/bid', formData);
    dispatch(setAlert('Příhoz byl proveden úspešně', 'success'));
  } catch (error) {}
};

export const createAuctionConnection = id => async dispatch => {
  echo
    .channel(`public.listing.${id}.price`)
    .listen(`.ListingPriceFor${id}`, ev => {
      dispatch({
        type: PRODUCT_UPDATE,
        payload: ev,
      });
    });
  echo
    .channel(`public.listing.${id}.status`)
    .listen(`.ListingStatusFor${id}`, ev => {
      dispatch({
        type: PRODUCT_UPDATE,
        payload: ev,
      });
    });
};
//Najít produkty podle kategoie
export const getProductsByCategory = params => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/listings', {
      params: {
        ...params,
        orderBy: params.orderBy.split('_')[0],
        orderByDirection:
          params.orderBy.split('_')[1] == 'reverse' ? 'desc' : 'asc',
      },
    });
    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};

export const getMyBids = () => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/auth/user/listings/bidding');

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};
export const getMyListings = () => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/auth/user/listings');

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};

// načíst oblíbené položky uživatele
export const loadUserFavourites = () => async dispatch => {
  dispatch(startLoading());
  try {
    const res = await api.get('/auth/user/favourite');

    dispatch({
      type: FAVOURITES_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: {
        msg: error.response,
        status: error.response,
      },
    });
  }
};

//přidat do oblíbeých
export const addToFavourite = id => async dispatch => {
  try {
    const res = await api.get('user/favourite/' + id + '/add');

    dispatch({
      type: ADD_PRODUCT_TO_FAVOURITE,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_FAVOURITE_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};
//odebrat z oblíbenýchh
export const removeFromFavourite = id => async dispatch => {
  try {
    const res = await api.delete('user/favourite/' + id + '/delete');

    dispatch({
      type: REMOVE_PRODUCT_FROM_FAVOURITE,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_FAVOURITE_ERROR,
      payload: {msg: error.response, status: error.response},
    });
  }
};

export const startLoading = () => async dispatch => {
  dispatch({type: PRODUCT_LOADING, payload: false});
};
export const startBidLoading = () => async dispatch => {
  dispatch({type: BID_LOADING, payload: false});
};
