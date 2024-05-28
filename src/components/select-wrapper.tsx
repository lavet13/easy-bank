import { FC } from 'react';

import Select, { SelectProps } from './select';
import useIsClient from '../common/hooks/use-is-client';

const SelectWrapper: FC<SelectProps> = props => {
  const { isClient, key } = useIsClient();
  return <>{isClient && <Select key={key} {...props} />}</>;
};

export default SelectWrapper;

