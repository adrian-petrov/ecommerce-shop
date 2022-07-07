import React from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { OptionText, RaRecord, useChoices } from 'ra-core';

export type Choice = {
  id: number;
  name: string;
};

type Props = {
  id: string;
  choice: RaRecord;
  optionText?: OptionText;
  optionValue?: string;
  onChange?: (...event: any[]) => void;
  value: any[];
  disabled?: boolean;
};

const CheckboxGroupInputItem = ({
  id,
  choice,
  optionText,
  optionValue,
  onChange,
  value,
  disabled = false,
  ...rest
}: Props) => {
  const { getChoiceText, getChoiceValue } = useChoices({
    optionText,
    optionValue,
  });

  const choiceName = getChoiceText(choice);

  return (
    <FormControlLabel
      htmlFor={`${id}_${getChoiceValue(choice)}`}
      onChange={onChange}
      control={
        <Checkbox
          id={`${id}_${getChoiceValue(choice)}`}
          color="primary"
          checked={
            value && Array.isArray(value)
              ? value.find((v) => v.name === getChoiceValue(choice)) !==
                undefined
              : false
          }
          value={String(getChoiceValue(choice))}
          disabled={disabled}
          {...rest}
        />
      }
      label={choiceName}
    />
  );
};

export default CheckboxGroupInputItem;
