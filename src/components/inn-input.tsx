import { FC, memo } from 'react';

import {
  PatternFormat,
  type PatternFormatProps,
  type OnValueChange,
} from 'react-number-format';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  type InputProps,
} from '@chakra-ui/react';

import { ErrorMessage, FastField, FastFieldProps } from 'formik';

type InnInputProps = { name: string; label: string } & InputProps &
  Partial<PatternFormatProps>;

const InnInput: FC<InnInputProps> = memo(({ name, label, ...props }) => {
  return (
    <FastField name={name}>
      {({
        field: { onChange, value, ...field },
        meta,
        form: { setFieldValue },
      }: FastFieldProps) => {
        const handleOnValueChange: OnValueChange = values => {
          const { value, formattedValue } = values;

          setFieldValue(name, { value, formattedValue });
        };

        return (
          <FormControl
            isRequired={props.isRequired}
            isInvalid={!!meta.error && meta.touched}
          >
            <FormLabel htmlFor={props.id || name}>{label}</FormLabel>
            <PatternFormat
              {...field}
              value={value?.value ?? ''}
              {...props}
              id={props.id || name}
              customInput={Input}
              format='############'
              type="tel"
              valueIsNumericString
              onValueChange={handleOnValueChange}
            />
            <ErrorMessage name={name} component={FormErrorMessage} />
          </FormControl>
        );
      }}
    </FastField>
  );
});

export default InnInput;
