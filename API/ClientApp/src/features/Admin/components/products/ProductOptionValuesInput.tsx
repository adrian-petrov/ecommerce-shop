import React from 'react';
import { CheckboxGroupInput, RaRecord } from 'react-admin';
import { useWatch } from 'react-hook-form';

type Props = {
  choices: RaRecord[];
};

const ProductOptionValuesInput = ({ choices }: Props) => {
  const options = useWatch({ name: 'productOptions ' });
  const optionValues = useWatch({ name: 'productOptionValues' });

  React.useEffect(() => {
    console.log(optionValues);
  });

  return (
    <CheckboxGroupInput
      optionValue="id"
      source="productOptions.productOptionValues"
      choices={choices}
      sx={{
        '& .MuiFormGroup-root': {
          background: 'rgba(0, 0, 0, 0.04)',
          padding: 1,
        },
      }}
    />
  );
};

export default ProductOptionValuesInput;
