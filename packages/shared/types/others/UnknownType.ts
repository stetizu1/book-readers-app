export type UnknownType<T> = {
  [P in keyof T]: unknown;
};
