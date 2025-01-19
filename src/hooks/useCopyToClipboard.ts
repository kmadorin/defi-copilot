import { useCallback } from 'react';
import copy from 'copy-to-clipboard';

export const useCopyToClipboard = (text: string): (() => void) => {
  return useCallback(() => {
    copy(text);
  }, [text]);
};
