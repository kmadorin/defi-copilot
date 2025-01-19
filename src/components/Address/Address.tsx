import { ForwardedRef, forwardRef } from 'react';
import { AddressProps } from './types';
import { trimAddress } from './trimAddress';

function Address(props: AddressProps, ref?: ForwardedRef<HTMLDivElement>) {
  const { symbols = 3, address, className = '', ...rest } = props;

  return (
    <div 
      {...rest} 
      ref={ref} 
      className={`relative inline-block font-normal ${className}`}
    >
      <span className="hidden group-hover:inline">{address}</span>
      <span className="inline group-hover:hidden">{trimAddress(address, symbols)}</span>
    </div>
  );
}

export default forwardRef(Address);
