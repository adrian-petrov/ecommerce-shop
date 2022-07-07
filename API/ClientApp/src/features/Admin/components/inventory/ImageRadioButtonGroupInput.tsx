import React from 'react';

import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  FormControl,
} from '@mui/material';
import { useInput } from 'react-admin';

type Props = {
  choices: any[];
  source: string;
};

const ImageRadioInput = ({ choices, source }: Props) => {
  const { field } = useInput({
    source,
  });

  return (
    <FormControl component="fieldset">
      <RadioGroup {...field} name={`name-${source}`} id={`id-${source}`} row>
        {choices.map((choice) => (
          <FormControlLabel
            key={choice.id}
            value={choice.id}
            label={choice.name}
            control={
              <Radio
                required
                checkedIcon={
                  <Avatar
                    sx={{
                      height: 180,
                      width: '100%',
                      border: '3px solid green',
                      padding: 2,
                    }}
                    src={choice.imageUrl}
                  />
                }
                icon={
                  <Avatar
                    sx={{
                      height: 180,
                      width: '100%',
                      border: '3px solid transparent',
                      padding: 2,
                    }}
                    src={choice.imageUrl}
                  />
                }
              />
            }
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ImageRadioInput;
