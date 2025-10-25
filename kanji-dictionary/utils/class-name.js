import  clxs from 'clxs';
import twMerge from 'tailwind-merge';

export function classNames(...args) {
  return twMerge(clxs(...args));
}