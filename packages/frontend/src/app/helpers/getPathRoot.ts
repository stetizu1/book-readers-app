import { MenuPath } from 'app/constants/Path';

export const getPathRoot = (pathName: string): string => {
  const pathValues = pathName.split('/');
  if (pathValues.length <= 1) return MenuPath.home;
  return `/${pathValues[1]}`;
};

export const getMenuPathRoot = (pathName: string): string => {
  const pathRoot = getPathRoot(pathName);
  return Object.values(MenuPath).find((path) => path === pathRoot) || MenuPath.home;
};
