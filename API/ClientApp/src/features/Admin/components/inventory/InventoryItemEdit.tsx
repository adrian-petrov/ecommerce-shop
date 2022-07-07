import React from 'react';
import { ChevronLeft } from '@mui/icons-material';
import { Grid } from '@mui/material';
import {
  Edit,
  ImageField,
  ListButton,
  NumberInput,
  SimpleForm,
  TextInput,
  TopToolbar,
  useRecordContext,
} from 'react-admin';
import { TAdminProductVariation } from '../../dataProvider/types';

const InventoryItemEdit = () => {
  return (
    <Grid item width={{ xs: '100%', lg: '90%' }}>
      <Edit actions={<EditActions />} title={<EditTitle />}>
        <SimpleForm>
          <Grid container width={{ xs: '100%' }} spacing={5}>
            <Grid item xs={12} md={6} direction="column">
              <TextInput source="name" disabled fullWidth />
              <TextInput source="sku" disabled fullWidth />
              <TextInput source="variationString" disabled fullWidth />
              <NumberInput source="price" fullWidth required />
              <NumberInput source="totalStock" fullWidth required />
            </Grid>
            <Grid item xs={12} md={5}>
              <ImageField
                source="imageUrl"
                title="Current Image"
                sx={{
                  img: {
                    height: 250,
                    maxWidth: 250,
                    marginLeft: 2,
                  },
                }}
              />
            </Grid>
          </Grid>
        </SimpleForm>
      </Edit>
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

const EditTitle = () => {
  const record = useRecordContext<TAdminProductVariation>();

  return <span>{record.variationString ? record.variationString : ''}</span>;
};

export default InventoryItemEdit;
