import { FC, memo, useTransition } from 'react';

import { FastField, FastFieldProps } from 'formik';

type RadioProps = {
  name: string;
  value: string;
  label: string;
  onChangeTab: (value: string, tab: string) => void;
};

const Radio: FC<RadioProps> = memo(
  ({ name, label, value, onChangeTab, ...props }) => {
    return (
      <FastField name={name} value={value} type='radio'>
        {({ field, form: { setFieldValue } }: FastFieldProps) => {
          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFieldValue(name, value);
            onChangeTab(value, name);
          };

          return (
            <label>
              <input
                type='radio'
                {...props}
                {...field}
                onChange={handleChange}
              />
              {label}
            </label>
          );
        }}
      </FastField>
    );
  },
);

export default Radio;
