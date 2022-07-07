import { Validator } from 'ra-core';

export const selectInputValidator: Validator = (value: any) => {
  if (!value) {
    return 'Please select a record';
  }
  return undefined;
};
