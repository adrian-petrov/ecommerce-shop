import React from 'react';
import merge from 'lodash/merge';
import { Admin, defaultTheme, Notification, Resource } from 'react-admin';
import { authProvider } from '../authProvider';
import Dashboard from '../components/dashboard';
import inventory from '../components/inventory';
import products from '../components/products';
import { dataProvider } from '../dataProvider';
import Layout from '../layout/Layout';

const theme = merge({}, defaultTheme, {
  typography: {
    fontSize: 20,
    h6: {
      fontWeight: 800,
    },
  },
});

const CustomNotification = (props: any) => (
  <Notification {...props} autoHideDuration={5000} />
);

export default function AdminPage() {
  return (
    <Admin
      basename="/admin"
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={theme}
      dashboard={Dashboard}
      layout={Layout}
      notification={CustomNotification}
      requireAuth
    >
      <Resource name="products" {...products} />
      <Resource name="inventory" {...inventory} />
    </Admin>
  );
}
