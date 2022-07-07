import { Typography, Avatar } from '@mui/material';
import React from 'react';
import { useRecordContext } from 'react-admin';
import { TAdminProductVariation } from '../../dataProvider/types';

const ProductVariationImageField = () => {
  const record = useRecordContext<TAdminProductVariation>();

  if (!record) return null;
  return (
    <Typography
      display="flex"
      flexWrap="nowrap"
      alignItems="center"
      component="div"
    >
      <Avatar
        src={`${record.imageUrl}`}
        style={{
          width: 30,
          height: 35,
          marginRight: 15,
        }}
      />
      {record.name}
    </Typography>
  );
};

ProductVariationImageField.defaultProps = {
  source: 'name',
};

export default ProductVariationImageField;
