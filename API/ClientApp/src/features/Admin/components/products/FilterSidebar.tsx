import React from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOfferOutlined';
import StoreIcon from '@mui/icons-material/Store';
import { Card, CardContent } from '@mui/material';
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  useGetList,
} from 'react-admin';
import { TProductBrand, TProductType } from '../../../Products/types';

const FilterSidebar = () => {
  const types = useGetList<TProductType>('types');
  const brands = useGetList<TProductBrand>('brands');

  return (
    <Card
      sx={{
        display: { sm: 'none', md: 'block' },
        order: -1,
        width: '15em',
        mr: 2,
        mt: 8,
        alignSelf: 'flex-start',
      }}
    >
      <CardContent>
        {/* Search */}
        <FilterLiveSearch source="name" />
        {/* Product Types */}
        <FilterList label="Product Types" icon={<LocalOfferIcon />}>
          {types.data &&
            types.data.map((item) => (
              <FilterListItem
                key={item.id}
                label={item.name}
                value={{
                  type: item.id,
                }}
              />
            ))}
        </FilterList>
        {/* Product Brands */}
        <FilterList label="Product Brands" icon={<StoreIcon />}>
          {brands.data &&
            brands.data.map((item) => (
              <FilterListItem
                key={item.id}
                label={item.name}
                value={{
                  brand: item.id,
                }}
              />
            ))}
        </FilterList>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
