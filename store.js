import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './src/reducers/index';
import setAuthToken from './src/utils/setAuthToken';
import {getStringAsync} from './src/utils/storage';
import {loadUser} from './src/actions/auth';
import {LOGOUT} from './src/actions/types';

const initialState = {};

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

getStringAsync('token').then(token => {
  setAuthToken(token);
  if (token) {
    store.dispatch(loadUser());
  } else {
    store.dispatch({type: LOGOUT});
  }
});

let currentState = store.getState();

store.subscribe(() => {
  let previousState = currentState;
  currentState = store.getState();
  if (previousState.auth.token !== currentState.auth.token) {
    const token = currentState.auth.token;
    setAuthToken(token);
  }
});

export {store};
