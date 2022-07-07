import { Card, CardContent } from '@mui/material';
import React from 'react';
import { Title } from 'react-admin';

const Dashboard = () => {
  return (
    <Card
      sx={{
        marginTop: 2,
        padding: 1,
      }}
    >
      <Title title="Ecommerce Admin Dashboard" />
      <CardContent>
        <h1>Welcome to the Admin Dashboard!</h1>
        <p>
          The Admin demo currently contains only 2 resources: <b>Products</b>{' '}
          and <b>Inventory</b>.
        </p>
        <p>
          They are fully CRUD capable and feature real-life database
          constraints.
        </p>
        <p>
          The data that has been seeded by default contains <b>27 products</b>{' '}
          and <b>448 Product Variations (Inventory)</b>.
        </p>
        <p>
          Each <b>Product Variation</b> has only 1 item in stock by default.
          This is to illustrate the store&apos;s variation builder on the
          frontend.
        </p>
        <p>
          Each individual <b>Option Value</b>, i.e. colour, size, waist, etc,
          holds its own stock based on how many times it is used in a product
          variation.
        </p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
