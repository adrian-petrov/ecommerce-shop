import { Box, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import {
  HttpError,
  NumberInput,
  RadioButtonGroupInput,
  SelectInput,
  useCreate,
  useDataProvider,
  useNotify,
} from 'react-admin';
import { SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { TAdminProduct } from '../../dataProvider/types';
import { selectInputValidator } from '../inputs/SelectInputValidator';
import ImageRadioButtonGroupInput from './ImageRadioButtonGroupInput';
import WizardForm, { WizardFormStep } from './WizardForm';

type Props = {
  productsData: TAdminProduct[] | undefined;
};

type TFormValues = {
  productId: string;
  totalStock: number;
  price: number;
  gender: string;
  colour: string;
  size: string;
  waist: string;
  length: string;
  image: string;
};

const InventoryItemCreateForm = ({ productsData }: Props) => {
  const methods = useForm<TFormValues>({
    defaultValues: {
      productId: '',
      totalStock: 0,
      price: 0,
      gender: '',
      colour: '',
      size: '',
      waist: '',
      length: '',
      image: '',
    },
  });

  const [selectedProductId, setSelectedProductId] = React.useState<
    number | null
  >(null);
  const [selectedProduct, setSelectedProduct] =
    React.useState<TAdminProduct | null>(null);
  const { handleSubmit, getValues, reset } = methods;

  const dataProvider = useDataProvider();
  const [create] = useCreate();
  const notify = useNotify();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<TFormValues> = (data) => {
    const currData = data as { [index: string]: string | number };
    Object.keys(currData).forEach((key) => {
      if (typeof currData[key] === 'string') {
        currData[key] = parseInt(currData[key] as string, 10) || 0;
      }
    });

    create(
      'inventory',
      { data },
      {
        onSuccess: () => {
          notify('Inventory item created successfully', {
            type: 'success',
            autoHideDuration: 5000,
          });
          navigate('/admin/products');
        },
        onError: (err) => {
          const error = err as HttpError;
          notify(error.message, {
            type: 'warning',
            autoHideDuration: 5000,
          });
        },
      },
    );
  };

  React.useEffect(() => {
    if (!selectedProductId) return;

    (async () => {
      const result = await dataProvider.getOne<TAdminProduct>('products', {
        id: selectedProductId,
      });

      setSelectedProduct(result.data);

      // always reset the form when a new product gets selected
      let values = getValues();
      reset({
        ...values,
        totalStock: 0,
        price: 0,
        gender: '',
        colour: '',
        size: '',
        waist: '',
        length: '',
        image: '',
      });

      result.data.productOptions.forEach((po) => {
        const currValues = getValues();
        reset({
          ...currValues,
          [po.name.toLowerCase()]: po.productOptionValues[0].id.toString(),
        });
      });

      values = getValues();
      reset({
        ...values,
        price: result.data.basePrice,
      });
    })();
  }, [selectedProductId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProductId(e as unknown as number);
  };

  if (!productsData) return null;

  return (
    <WizardForm
      formMethods={methods as unknown as UseFormReturn}
      handleFormSubmit={handleSubmit(onSubmit)}
    >
      {/* SELECT PRODUCT */}
      <WizardFormStep label="Select a Product" formValue="productId">
        <SelectInput
          source="productId"
          choices={productsData}
          fullWidth
          required
          onChange={handleChange}
          validate={selectInputValidator}
        />
      </WizardFormStep>
      {/* STOCK AND PRICE */}
      <WizardFormStep
        label="Price &amp; Stock"
        formValue={['totalStock', 'price']}
      >
        {selectedProduct && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NumberInput
              source="price"
              type="number"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">£</InputAdornment>
                ),
              }}
              required
            />

            <NumberInput source="totalStock" type="number" fullWidth required />
          </Box>
        )}
      </WizardFormStep>

      {/* SELECT OPTIONS, ETC */}
      <WizardFormStep
        label="Select the options"
        formValue={['gender', 'colour', 'size', 'waist', 'length']}
      >
        {selectedProduct &&
          selectedProduct.productOptions
            .sort((a, b) => (a.optionId > b.optionId ? 1 : -1))
            .map((po) => {
              return (
                <div key={po.id}>
                  <Typography variant="h6" gutterBottom>
                    {po.name}
                  </Typography>
                  <RadioButtonGroupInput
                    source={po.name.toLowerCase()}
                    choices={po.productOptionValues}
                  />
                </div>
              );
            })}
      </WizardFormStep>
      {/* SELECT IMAGES */}
      <WizardFormStep label="Select an image" formValue="image">
        {selectedProduct && (
          <ImageRadioButtonGroupInput
            source="image"
            choices={selectedProduct.images}
          />
        )}
      </WizardFormStep>
    </WizardForm>
  );
};

export default InventoryItemCreateForm;
