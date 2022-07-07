import React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import Menu from './Menu';

const CustomLayout = (props: LayoutProps) => {
  return <Layout {...props} menu={Menu} />;
};

export default CustomLayout;
