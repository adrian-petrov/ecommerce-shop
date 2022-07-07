import { Avatar, Typography } from '@mui/material';
import React from 'react';
import { useRecordContext } from 'react-admin';
import { TAdminProduct } from '../../dataProvider/types';

function ProductImageField() {
  const record = useRecordContext<TAdminProduct>();

  if (!record) return null;
  return (
    <Typography
      display="flex"
      flexWrap="nowrap"
      alignItems="center"
      component="div"
    >
      <Avatar
        src={`${record.images[0].imageUrl}`}
        style={{
          width: 30,
          height: 35,
          marginRight: 15,
        }}
      />
      {record.name}
    </Typography>
  );
}

ProductImageField.defaultProps = {
  source: 'name',
};

export default ProductImageField;
