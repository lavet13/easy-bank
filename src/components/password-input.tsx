import { FC, memo, useEffect, useRef, useState } from 'react';

import {
  ErrorMessage,
  FastField,
  FastFieldProps,
} from 'formik';

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { ConsoleLog } from '../utils/debug/console-log';

type PasswordInputProps = {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  id?: string;
  shouldFocus?: boolean;
} & InputProps;

const PasswordInput: FC<PasswordInputProps> = memo(
  ({ label, name, shouldFocus, isRequired, ...props }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [show, setShow] = useState(false);

    const handleClick = () => setShow(s => !s);

    useEffect(() => {
      shouldFocus && inputRef.current?.focus();
    }, [shouldFocus]);

    return (
      <FastField name={name} {...(show ? { show } : {})}>
        {({ field: { value, ...field }, meta }: FastFieldProps) => {
          return (
            <FormControl
              isRequired={isRequired}
              isInvalid={!!meta.error && meta.touched}
            >
              <FormLabel id={props.id || name} htmlFor={props.id || name}>
                {label}
              </FormLabel>
              <InputGroup size="lg">
                <Input
                  {...field}
                  {...props}
                  value={value || ''}
                  type={show ? 'text' : 'password'}
                  id={props.id || name}
                  ref={inputRef}
                />
                <InputRightElement w='6.5rem'>
                  <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Спрятать' : 'Показать'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <ErrorMessage name={name} component={FormErrorMessage} />
            </FormControl>
          );
        }}
      </FastField>
    );
  }
);

export default PasswordInput;
