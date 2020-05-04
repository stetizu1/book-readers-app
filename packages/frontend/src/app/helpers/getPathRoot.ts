import { MenuPath } from '../constants/Path';

export const getPathRoot = (pathName: string): string => {
  const pathValues = pathName.split('/');
  if (pathValues.length <= 1) return MenuPath.home;
  return `/${pathValues[1]}`;
};
