import React from 'react';
import { ChevronLeft } from '@mui/icons-material';
import { Card, Grid } from '@mui/material';
import { useGetList } from 'ra-core';
import { ListButton, Title, TopToolbar } from 'react-admin';
import InventoryItemCreateForm from './InventoryItemCreateForm';

const InventoryItemCreate = () => {
  const { data: productsData } = useGetList('products', {
    pagination: {
      page: 1,
      perPage: 250,
    },
  });

  return (
    <Grid>
      <Title title="Create New Product Variation" />
      <CreateActions />
      <Card>
        <InventoryItemCreateForm productsData={productsData} />
      </Card>
    </Grid>
  );
};

const CreateActions = () => {
  return (
    <TopToolbar
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      <ListButton
        sx={{
          zIndex: 100,
        }}
        label="Back"
        icon={<ChevronLeft />}
      />
    </TopToolbar>
  );
};

export default InventoryItemCreate;
