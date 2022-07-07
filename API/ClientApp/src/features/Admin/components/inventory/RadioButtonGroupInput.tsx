import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { RaRecord, useInput } from 'ra-core';

type Props = {
  choices: RaRecord[];
  source: string;
  id: number;
};

const RadioButtonGroupInput = ({ choices, source, id: idProp }: Props) => {
  const { id, isRequired, fieldState, field, formState } = useInput({
    source,
  });

  return (
    <FormControl component="fieldset">
      <RadioGroup {...field} name={`name-${idProp}`} id={`id-${idProp}`}>
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id}
            label={choice.name}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroupInput;
