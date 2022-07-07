import React, { ReactElement } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { selectUser } from '../features/Account/accountSlice';
import { getCurrentUser } from '../features/Account/accountThunks';
import AdminPage from '../features/Admin/pages/AdminPage';
import { selectBasket } from '../features/Basket/basketSlice';
import { getBasket } from '../features/Basket/basketThunks';
import {
  selectPagination,
  selectProductFilters,
} from '../features/Products/productsSlice';
import {
  getProductFilters,
  getProducts,
} from '../features/Products/productsThunks';
import StoreFront from '../layout/Layout';
import { useAppDispatch, useAppSelector } from './hooks';

export default function App(): ReactElement {
  const user = useAppSelector(selectUser);
  const pagination = useAppSelector(selectPagination);
  const basket = useAppSelector(selectBasket);
  const filters = useAppSelector(selectProductFilters);

  const dispatch = useAppDispatch();

  // get current user
  React.useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  // get basket
  React.useEffect(() => {
    if (basket.length > 0) return;
    dispatch(getBasket());
  }, [user]);

  // get products
  React.useEffect(() => {
    if (pagination.data.length) return;
    dispatch(getProducts());
  }, []);

  // get filters
  React.useEffect(() => {
    if (filters.types.length > 0) return;
    dispatch(getProductFilters());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<StoreFront user={user} />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}
