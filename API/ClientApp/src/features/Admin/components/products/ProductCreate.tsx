import React from 'react';
import { ChevronLeft } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { ListButton, Title, TopToolbar, useGetList } from 'react-admin';
import { Card } from 'react-bootstrap';
import ProductCreateForm from './ProductCreateForm';

const ProductCreate = () => {
  const { data: brandsData } = useGetList('brands');
  const { data: typesData } = useGetList('types');
  const { data: optionsData } = useGetList('options');
  const { data: optionValuesData } = useGetList('optionvalues');

  return (
    <Grid item width={{ xs: '100%', lg: '90%' }}>
      <Title title="Create New Product" />
      <CreateActions />
      <Card>
        <ProductCreateForm
          brandsData={brandsData}
          typesData={typesData}
          optionsData={optionsData}
          optionValuesData={optionValuesData}
        />
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

export default ProductCreate;
