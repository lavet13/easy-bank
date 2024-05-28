import { FC, memo } from 'react';

import { ErrorMessage, FastField, FastFieldProps } from 'formik';

import {
  FormErrorMessage,
  FormControl,
  FormLabel,
  Box,
  Spinner,
  Flex,
} from '@chakra-ui/react';

import { Select as ChakraSelect } from 'chakra-react-select';

import type { ChakraStylesConfig, SelectComponent } from 'chakra-react-select';
import { ConsoleLog } from '../utils/debug/console-log';

export type SelectProps = {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  id?: string;
  data?: any[];
  isGroup?: boolean;
  isLoading?: boolean;
} & Partial<SelectComponent>;

const Select: FC<SelectProps> = memo(
  ({ name, label, data, isGroup = false, isLoading, ...props }) => {
    // field { name, value, onChange, onBlur }
    // meta { value, error, touched, initialValue, initialError, initialTouched }
    // helpers { setValue, setTouched, setError }

    return (
      <FastField name={name} {...(isLoading ? { isLoading } : {})}>
        {({
          field: { onChange, ...field },
          meta,
          form: { setFieldValue },
        }: FastFieldProps) => {
          const handleChange = (option: any) => {
            ConsoleLog({ option });
            setFieldValue(name, option.value);
          };

          const handleGroupSelection = (value: any) => {
            if (value === '') {
              return { label: props.placeholder || '', value: '' };
            }

            const options = data?.reduce(
              (acc, { options }) => [...acc, ...options],
              []
            );

            const selectedOption = options?.find(
              (option: any) => option.value === field.value
            );

            return selectedOption;
          };

          const handleSelection = (value: any) => {
            if (value === '') {
              return { label: props.placeholder || '', value: '' };
            }

            const selectedOption = data?.find(
              (option: any) => option.value === field.value
            );

            return selectedOption;
          };

          const chakraStyles: ChakraStylesConfig = {
            dropdownIndicator: (provided, { selectProps }) => ({
              ...provided,
              '> svg': {
                transform: `rotate(${selectProps.menuIsOpen ? -180 : 0}deg)`,
              },
            }),
          };

          return (
            <FormControl
              isRequired={props.isRequired}
              isInvalid={!!meta.error && meta.touched}
            >
              <FormLabel htmlFor={props.id || name}>{label}</FormLabel>

              <ChakraSelect
                {...field}
                {...props}
                isLoading={isLoading}
                id={props.id || name}
                value={
                  isGroup
                    ? handleGroupSelection(field.value)
                    : handleSelection(field.value)
                }
                onChange={handleChange}
                loadingMessage={() => (
                  <Flex justify='center' gap={2}>
                    <Spinner />
                  </Flex>
                )}
                selectedOptionStyle={'check'}
                noOptionsMessage={() => <Box>Нет данных</Box>}
                options={data}
                chakraStyles={chakraStyles}
              />
              <ErrorMessage name={name} component={FormErrorMessage} />
            </FormControl>
          );
        }}
      </FastField>
    );
  }
);

export default Select;
