import { Path } from 'app/constants/Path';

export const parametrizedPathWithId = (path: typeof Path[keyof typeof Path]): string => (
  `${path}/:id`
);

export const withParameterPath = (path: typeof Path[keyof typeof Path], parameter: number | string): string => (
  `${path}/${parameter}`
);
