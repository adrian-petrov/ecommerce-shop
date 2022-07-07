import React from 'react';
import { Theme, useMediaQuery } from '@mui/material';
import {
  Datagrid,
  FilterLiveSearch,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
} from 'react-admin';
import FilterSidebar from './FilterSidebar';
import ProductImageField from './ProductImageField';

const ProductList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <List
      aside={<FilterSidebar />}
      filters={isSmall ? productFilters : undefined}
    >
      <Datagrid optimized rowClick="edit">
        <TextField source="id" />
        <ProductImageField />
        <TextField source="basePrice" />
        <TextField source="type" />
        <TextField source="brand" />
      </Datagrid>
    </List>
  );
};

export const productFilters = [
  <FilterLiveSearch key={1} source="name" />,
  <ReferenceInput key={2} source="brand" reference="brands">
    <SelectInput source="name" />
  </ReferenceInput>,
  <ReferenceInput key={3} source="type" reference="types">
    <SelectInput source="name" />
  </ReferenceInput>,
];

export default ProductList;
