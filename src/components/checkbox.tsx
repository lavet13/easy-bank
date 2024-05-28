import { FC, memo } from 'react';

import { ErrorMessage, FastField, FastFieldProps } from 'formik';

import {
  Checkbox as ChakraCheckbox,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

import type { CheckboxProps as ChakraCheckboxProps } from '@chakra-ui/react';

type CheckboxProps = { name: string } & ChakraCheckboxProps;

const Checkbox: FC<CheckboxProps> = memo(
  ({ name, children, ...props }) => {
    return (
      <FastField name={name} type='checkbox'>
        {({ field, meta }: FastFieldProps) => {
          return (
            <FormControl
              isRequired={props.isRequired}
              isInvalid={!!meta.error && meta.touched}
            >
              <ChakraCheckbox isChecked={field.checked} {...field} {...props}>
                {children}
              </ChakraCheckbox>

              <ErrorMessage name={name} component={FormErrorMessage} />
            </FormControl>
          );
        }}
      </FastField>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name;
  },
);

export default Checkbox;
