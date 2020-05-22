export type IdMap<T extends {}> = {
  [id: number]: T;
};

export type IdMapOptional<T extends {}> = {
  [id: number]: T | undefined;
};
