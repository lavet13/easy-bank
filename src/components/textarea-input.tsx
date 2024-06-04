import React, { FC, memo, useEffect, useRef } from 'react';

import { ErrorMessage, FastField, FastFieldProps } from 'formik';

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
  TextareaProps,
} from '@chakra-ui/react';
import { ConsoleLog } from '../utils/debug/console-log';

type TextInputProps = {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  id?: string;
  shouldFocus?: boolean;
} & TextareaProps;

const TextareaInput: FC<TextInputProps> = memo(
  ({ label, name, shouldFocus, ...props }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    // ConsoleLog({ name, id: props.id });

    useEffect(() => {
      shouldFocus && inputRef.current?.focus();
    }, [shouldFocus]);

    return (
      <FastField name={name}>
        {({ field: { value, ...field }, meta }: FastFieldProps) => (
          <FormControl
            isRequired={props.isRequired}
            isInvalid={!!meta.error && meta.touched}
          >
            <FormLabel id={props.id || name} htmlFor={props.id || name}>
              {label}
            </FormLabel>
            <Textarea
              {...field}
              {...props}
              value={value || ''}
              type={props.type || 'text'}
              id={props.id || name}
              ref={inputRef}
            />
            <ErrorMessage name={name} component={FormErrorMessage} />
          </FormControl>
        )}
      </FastField>
    );
  }
);

export default TextareaInput;
