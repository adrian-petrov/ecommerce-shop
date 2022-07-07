import { combineReducers } from '@reduxjs/toolkit';
import productsReducer from '../features/Products/productsSlice';
import basketReducer from '../features/Basket/basketSlice';
import accountReducer from '../features/Account/accountSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  basket: basketReducer,
  account: accountReducer,
});

export default rootReducer;
