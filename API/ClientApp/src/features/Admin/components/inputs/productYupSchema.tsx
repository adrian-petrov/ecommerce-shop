import * as yup from 'yup';
import { TAdminImage } from '../../dataProvider/types';

export const schema = yup.object().shape({
  name: yup.string().required('This is a required field'),
  description: yup.string().required('This is a required field'),
  basePrice: yup
    .number()
    .typeError('Please input a number')
    .required('This is a required field'),
  productTypeId: yup
    .number()
    .typeError('Please select a type')
    .required('Please select a type'),
  productBrandId: yup
    .number()
    .typeError('Please select a brand')
    .required('Please select a brand'),
  productOptions: yup
    .array()
    .of(yup.number())
    .test(
      'Colour, gender, and relevant sizes are selected',
      'Please select the gender, colour, and at least one of the following: Size, Waist, or Length',
      (value) =>
        value !== undefined &&
        value.includes(1) &&
        value.includes(2) &&
        (value.includes(3) || value.includes(4) || value.includes(5)),
    ),
  productOptionValues: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number(),
        name: yup.string(),
        productOptionId: yup.number(),
        optionId: yup.number(),
        stock: yup.number(),
      }),
    )
    .test(
      'At least one of each option value is selected',
      'Please select at least one option value for each selected option',
      (value, context) => {
        // ensure that 1, 2 and one of 3 || 4 || 5 are in this array
        const productOptions: number[] = context.parent.productOptions;
        let isValid = false;

        isValid = productOptions.every((po) =>
          value?.some((v) => v.optionId === po),
        );
        return isValid;
      },
    ),
  images: yup
    .array()
    .of(
      yup.object().test({
        name: 'Image must best less than 10MB',
        message: 'The image size must be less than 10MB',
        test: (value) => {
          const img = value as unknown as TAdminImage;

          return img.rawFile!.size <= 10000000;
        },
      }),
    )
    .min(1, 'Please upload at least 1 image'),
});
