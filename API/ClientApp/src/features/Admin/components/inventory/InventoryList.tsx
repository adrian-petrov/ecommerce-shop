import React from 'react';
import { useMediaQuery, Theme } from '@mui/material';
import { Datagrid, List, NumberField, TextField } from 'react-admin';
import FilterSidebar from '../products/FilterSidebar';
import { productFilters } from '../products/ProductList';
import ProductVariationImageField from './ProductVariationImageField';

const InventoryList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

  return (
    <List
      title="Inventory"
      aside={<FilterSidebar />}
      filters={isSmall ? productFilters : undefined}
    >
      <Datagrid optimized rowClick="edit">
        <TextField source="id" />
        <ProductVariationImageField />
        <TextField source="sku" />
        <TextField source="variationString" />
        <NumberField source="price" />
        <NumberField source="totalStock" />
      </Datagrid>
    </List>
  );
};

export default InventoryList;
