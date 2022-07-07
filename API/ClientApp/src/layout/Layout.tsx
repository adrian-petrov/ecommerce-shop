import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import PrivateRoute from '../components/PrivateRoute';
import RouteNotFound from '../components/RouteNotFound';
import AccountPage from '../features/Account/pages/AccountPage';
import AuthenticationPage from '../features/Account/pages/AuthenticationPage';
import DetailsPage from '../features/Account/pages/DetailsPage';
import OrdersPage from '../features/Account/pages/OrdersPage';
import OrderSuccessfulPage from '../features/Account/pages/OrderSuccessfulPage';
import { TCurrentUser } from '../features/Account/types';
import BasketPage from '../features/Basket/pages/BasketPage';
import CheckoutPage from '../features/Basket/pages/CheckoutPage';
import HomePage from '../features/Home/pages/HomePage';
import GenderPage from '../features/Products/pages/GenderPage';
import ProductsListPage from '../features/Products/pages/ProductsListPage';
import ProductsPage from '../features/Products/pages/ProductsPage';
import ProductTypeListPage from '../features/Products/pages/ProductTypeListPage';
import SingleProductPage from '../features/Products/pages/SingleProductPage';
import SearchPage from '../features/Search/pages/SearchPage';
import Footer from './Footer';
import Header from './Header';

interface ILayout {
  user: TCurrentUser | null;
}

const StoreFrontRoot = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledLayout = styled.main`
  flex: 1;
`;

export default function Layout({ user }: ILayout) {
  return (
    <StoreFrontRoot>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
      />
      <Header />
      <StyledLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />}>
            <Route index element={<ProductsListPage />} />
            <Route path="women" element={<GenderPage />}>
              <Route path=":productType" element={<ProductTypeListPage />} />
            </Route>
            <Route path="men" element={<GenderPage />}>
              <Route path=":productType" element={<ProductTypeListPage />} />
            </Route>
            <Route path=":productId" element={<SingleProductPage />} />
          </Route>
          <Route element={<PrivateRoute isAllowed={!!user} />}>
            <Route path="/account" element={<AccountPage />}>
              <Route path="orders/*" element={<OrdersPage />} />
              <Route path="details" element={<DetailsPage />} />
            </Route>
            <Route path="/checkout/*" element={<CheckoutPage />} />
          </Route>
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/authenticate" element={<AuthenticationPage />} />
          <Route path="/order-successful" element={<OrderSuccessfulPage />} />
          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </StyledLayout>
      <Footer />
    </StoreFrontRoot>
  );
}
