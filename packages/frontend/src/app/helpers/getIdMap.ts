import { IdMap, IdMapOptional } from 'app/types/IdMap';

export const getIdMap = <T extends {}, K extends keyof T>(key: K, data: T[] | undefined): IdMap<T> | undefined => (
  data?.reduce((map: IdMap<T>, object) => ({
    ...map,
    [Number(object[key])]: object,
  }), {})
);

export const getIdMapOptional = <T extends {}, K extends keyof T>(key: K, data: T[] | undefined): IdMapOptional<T> | undefined => (
  data?.reduce((map: IdMap<T>, object) => ({
    ...map,
    [Number(object[key])]: object,
  }), {})
);
