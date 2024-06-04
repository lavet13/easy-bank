import { mixed } from 'yup';

import { NumberFormatValues } from 'react-number-format';

const priceValidationSchema = () =>
  mixed<NumberFormatValues>()
    .defined()
    .test(
      'priceIsRequired',
      'Цена обязательна!',
      values => typeof values.value !== 'undefined'
    );

export default priceValidationSchema;
