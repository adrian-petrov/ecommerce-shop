import React, { useCallback } from 'react';
import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import clsx from 'clsx';
import { get } from 'lodash';
import { useInput } from 'ra-core';
import {
  CheckboxGroupInputProps,
  FieldTitle,
  InputHelperText,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { TAdminProductOptionValue } from '../../dataProvider/types';
import CheckboxGroupInputItem from './CheckboxGroupInputItem';

type Props = Partial<CheckboxGroupInputProps>;

const CheckboxGroupInput = ({
  choices,
  helperText,
  label,
  onBlur,
  onChange,
  optionText = 'name',
  optionValue = 'id',
  row = true,
  source,
  validate,
  ...rest
}: Props) => {
  const productOptions: any[] | string[] = useWatch({
    name: 'productOptions',
  });

  if (source === undefined) return null;

  const {
    field: { onChange: formOnChange, onBlur: formOnBlur, value },
    fieldState: { error, isTouched },
    formState: { isSubmitted },
    id,
    isRequired,
  } = useInput({
    source,
    validate,
    onChange,
    onBlur,
    ...rest,
  });

  const handleCheck = useCallback(
    (event, isChecked) => {
      let newValue: any;

      if (
        choices !== undefined &&
        choices.every((item) => typeof get(item, optionValue) === 'number')
      ) {
        try {
          newValue = JSON.parse(event.target.value); // XL - 32L - 34W
        } catch (e) {
          newValue = event.target.value;
        }
      } else {
        newValue = event.target.value;
      }

      if (isChecked) {
        // {id: 43, name: 'Mens', optionId: 1}
        const newValueObject = choices?.find((item) => item.name === newValue);
        // we delete the Id property because it needs to be undefined
        delete newValueObject.id;

        formOnChange([...(value || []), newValueObject]);
      } else {
        formOnChange(
          value.filter((v: TAdminProductOptionValue) => v.name !== newValue),
        );
      }
      formOnBlur(); // Ensure field is flagged as touched
    },
    [choices, formOnChange, formOnBlur, optionValue, value],
  );

  return (
    <FormControl
      component="fieldset"
      error={(isTouched || isSubmitted) && error !== null}
      className={clsx('ra-input', `ra-input-${source}`)}
    >
      <FormLabel component="legend">
        <FieldTitle label={label} isRequired={isRequired} />
      </FormLabel>
      <FormGroup
        row={row}
        sx={{
          background: 'rgba(0, 0, 0, 0.04)',
          padding: 1,
        }}
      >
        {choices?.map((choice) => {
          return (
            <CheckboxGroupInputItem
              key={get(choice, optionValue)}
              choice={choice}
              id={id}
              onChange={handleCheck}
              optionText={optionText}
              optionValue={optionValue}
              value={value}
              disabled={
                Array.isArray(value) &&
                !productOptions.includes(choice.optionId)
              }
            />
          );
        })}
      </FormGroup>
      <FormHelperText>
        <InputHelperText
          touched={isTouched || isSubmitted}
          error={error?.message}
          helperText={helperText}
        />
      </FormHelperText>
    </FormControl>
  );
};

export default CheckboxGroupInput;

const PREFIX = 'RaCheckboxGroupInput';

export const CheckboxGroupInputClasses = {
  label: `${PREFIX}-label`,
};
