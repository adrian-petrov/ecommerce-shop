import React from 'react';
import { ChevronLeft } from '@mui/icons-material';
import { Card, Grid } from '@mui/material';
import {
  ListButton,
  Title,
  TopToolbar,
  useGetList,
  useGetOne,
} from 'react-admin';
import { useParams } from 'react-router-dom';
import ProductEditForm from './ProductEditForm';

const ProductEdit = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetOne('products', { id });

  const { data: brandsData } = useGetList('brands');
  const { data: typesData } = useGetList('types');
  const { data: optionsData } = useGetList('options');
  const { data: optionValuesData } = useGetList('optionvalues');

  if (isLoading || !data) return null;

  return (
    <Grid item width={{ xs: '100%', lg: '90%' }}>
      <Title title={data.name} />
      <EditActions />
      <Card>
        <ProductEditForm
          record={data}
          brandsData={brandsData}
          typesData={typesData}
          optionsData={optionsData}
          optionValuesData={optionValuesData}
        />
      </Card>
    </Grid>
  );
};

const EditActions = () => {
  return (
    <TopToolbar
      sx={{
        justifyContent: 'flex-start',
      }}
    >
      <ListButton label="Back" icon={<ChevronLeft />} />
    </TopToolbar>
  );
};

export default ProductEdit;
