import { FC, memo } from 'react';

import {
  NumericFormat,
  NumericFormatProps,
  OnValueChange,
} from 'react-number-format';

import { ErrorMessage, FastField, FastFieldProps, useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import type { InputProps } from '@chakra-ui/react';
import { ConsoleLog } from '../utils/debug/console-log';

type NumberInputProps = {
  name: string;
  label: string;
} & InputProps &
  NumericFormatProps;

const NumberInput: FC<NumberInputProps> = memo(
  ({ name, label, ...props }) => {
    return (
      <FastField name={name}>
        {({
          field: { onChange, value, ...field },
          meta,
          form: { setFieldValue },
        }: FastFieldProps) => {
          const { value: unformattedValue } = value;

          const handleOnValueChange: OnValueChange = values => {
            const { formattedValue, value, floatValue } = values;

            setFieldValue(name, { formattedValue, value, floatValue });
          };

          return (
            <FormControl
              isRequired={props.isRequired}
              isInvalid={!!meta.error && meta.touched}
            >
              <FormLabel htmlFor={props.id || name}>{label}</FormLabel>

              <NumericFormat
                {...field}
                value={unformattedValue}
                {...props}
                id={props.id || name}
                customInput={Input}
                decimalScale={0}
                type='tel'
                isAllowed={({ floatValue }) =>
                  typeof floatValue === 'undefined' || floatValue > 0
                }
                valueIsNumericString
                allowNegative={false}
                onValueChange={handleOnValueChange}
              />

              <ErrorMessage name={name} component={FormErrorMessage} />
            </FormControl>
          );
        }}
      </FastField>
    );
  }
);

export default NumberInput;
