import { string } from 'yup';
import { validateEmail } from '../form/validate-email';

const emailValidationSchema = () =>
  string()
    .required('Обязательное поле!')
    .test(
      'isEmailValid',
      'Некорректный адрес электронной почты!',
      value => !!validateEmail(value)
    );

export default emailValidationSchema;
