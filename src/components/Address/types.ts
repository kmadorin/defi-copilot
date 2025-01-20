import { ComponentProps } from '../utils/types';

export type AddressProps = ComponentProps<
  'div',
  {
    address: string;
    symbols?: number;
  }
>;
