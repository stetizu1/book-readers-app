import {
  PathPrefix, PathPostfix, BasePath, PathParam,
} from '../constants/Path';

export type PathCreator = () => string;
export type PathCreatorWithParam = (param?: string | number) => string;
export type PathCreatorWithTwoParams = (param?: string | number, secondParam?: string | number) => string;

export const composePath = (path: BasePath, all = false, ...pathSpec: (string | number)[]): PathCreator => {
  const specs = (pathSpec.length > 0) ? `/${pathSpec.join('/')}` : '';
  const post = all ? PathPostfix.getAll : '';
  return (): string => (
    `${PathPrefix.prefix}${path}${post}${specs}`
  );
};

export const composePathWithParam = (path: BasePath, all = false, ...pathSpec: (string | number)[]): PathCreatorWithParam => {
  const specs = (pathSpec.length > 0) ? `/${pathSpec.join('/')}` : '';
  const post = all ? PathPostfix.getAll : '';
  return (param = PathParam.param): string => (
    `${PathPrefix.prefix}${path}${post}${specs}/${param}`
  );
};

export const composePathWithTwoParams = (path: BasePath, all = false, ...pathSpec: (string | number)[]): PathCreatorWithTwoParams => {
  const specs = (pathSpec.length > 0) ? `/${pathSpec.join('/')}` : '';
  const post = all ? PathPostfix.getAll : '';
  return (param = PathParam.param, secondParam = PathParam.secondParam): string => (
    `${PathPrefix.prefix}${path}${post}${specs}/${param}/${secondParam}`
  );
};
