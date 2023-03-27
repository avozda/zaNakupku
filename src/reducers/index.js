import {combineReducers} from 'redux';
import category from './category';
import product from './product';
import featured from './featured';
import globalSearch from './globalSearch';
import alert from './alert';
import profile from './profile';
import auth from './auth';
import checkout from './checkout';
export default combineReducers({
  category,
  product,
  featured,
  globalSearch,
  alert,
  profile,
  checkout,
  auth,
});
