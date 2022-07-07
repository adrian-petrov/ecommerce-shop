import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, InputAdornment, Typography } from '@mui/material';
import {
  CheckboxGroupInput,
  ImageField,
  ImageInput,
  SaveButton,
  SelectInput,
  TextInput,
  Toolbar,
  useCreate,
  useNotify,
} from 'react-admin';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { schema } from '../inputs/productYupSchema';
import {
  TAdminImage,
  TAdminProductOption,
  TAdminProductOptionValue,
} from '../../dataProvider/types';
import CustomCheckboxGroupInput from './CheckboxGroupInput';

type Props = {
  brandsData: any[] | undefined;
  typesData: any[] | undefined;
  optionsData: any[] | undefined;
  optionValuesData: any[] | undefined;
};

type TFormValues = {
  name: string;
  description: string;
  basePrice: number;
  productTypeId: number;
  productBrandId: number;
  productOptions: TAdminProductOption[] | number[];
  productOptionValues: TAdminProductOptionValue[];
  images: TAdminImage[];
};

const ProductCreateForm = ({
  brandsData,
  typesData,
  optionsData,
  optionValuesData,
}: Props) => {
  const methods = useForm<TFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      basePrice: undefined,
      productTypeId: undefined,
      productBrandId: undefined,
      productOptions: [],
      productOptionValues: [],
      images: [],
    },
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const navigate = useNavigate();
  const notify = useNotify();
  const [create] = useCreate();

  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    data.productOptionValues = data.productOptionValues.map((pov) => {
      if (pov.optionId === 4) {
        return {
          id: pov.id,
          name: pov.name.slice(0, pov.name.length - 1), // remove L or W from the name
          productOptionId: pov.productOptionId,
          optionId: pov.optionId,
          stock: pov.stock,
        };
      }

      if (pov.optionId === 5) {
        return {
          id: pov.id,
          name: pov.name.slice(0, pov.name.length - 1), // remove L or W from the name
          productOptionId: pov.productOptionId,
          optionId: pov.optionId,
          stock: pov.stock,
        };
      }

      return pov;
    });

    create(
      'products',
      { data },
      {
        onSuccess: () => {
          notify('Product created successfully', {
            type: 'success',
            autoHideDuration: 5000,
          });
          navigate('/admin/products');
        },
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid
          container
          width={{ xs: '100%' }}
          spacing={4}
          sx={{
            padding: 2,
          }}
        >
          {/* LEFT HAND SIDE FORM */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            {/* PRODUCT NAME */}
            <TextInput source="name" fullWidth />
            {/* DESCRIPTION */}
            <TextInput source="description" fullWidth multiline />
            {/* BASE PRICE */}
            <TextInput
              source="basePrice"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
              }}
            />
            {/* IMAGES */}
            <Typography variant="h6" gutterBottom>
              Images
            </Typography>
            <ImageInput
              source="images"
              name="images"
              accept=".png, .jpg"
              multiple
              sx={{
                '& .MuiFormHelperText-root': {
                  color: 'red',
                  fontSize: 16,
                },
              }}
            >
              <ImageField
                source="imageUrl"
                sx={{
                  img: {
                    height: 130,
                    maxWidth: 130,
                    marginRight: 1,
                  },
                }}
              />
            </ImageInput>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Brands
            </Typography>
            {/* BRANDS */}
            {brandsData ? (
              <SelectInput
                source="productBrandId"
                choices={brandsData}
                optionValue="id"
                optionText="name"
                fullWidth
              />
            ) : null}
            <Typography variant="h6" gutterBottom>
              Types
            </Typography>
            {/* TYPES */}
            {typesData ? (
              <SelectInput
                source="productTypeId"
                choices={typesData}
                optionValue="id"
                optionText="name"
                fullWidth
              />
            ) : null}
            <Typography variant="h6" gutterBottom>
              Options
            </Typography>
            {/* OPTIONS */}
            {optionsData && (
              <CheckboxGroupInput
                label=""
                source="productOptions"
                choices={optionsData}
                optionValue="id"
                sx={{
                  '& .MuiFormGroup-root': {
                    background: 'rgba(0, 0, 0, 0.04)',
                    padding: 1,
                  },
                }}
              />
            )}
            <Typography variant="h6" gutterBottom>
              Option Values
            </Typography>
            {/* OPTION VALUES */}
            {optionValuesData && (
              <CustomCheckboxGroupInput
                choices={optionValuesData}
                source="productOptionValues"
                optionValue="name"
              />
            )}
          </Grid>
        </Grid>
        <Toolbar>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <SaveButton label="Save" type="submit" disabled={isSubmitting} />
          </Box>
        </Toolbar>
      </form>
    </FormProvider>
  );
};

export default ProductCreateForm;
