import { IdMap } from 'app/types/IdMap';

export const getIdMap = <T extends {}, K extends keyof T>(key: K, data: T[] | undefined): IdMap<T> | undefined => (
  data?.reduce((map: IdMap<T>, object) => ({
    ...map,
    [Number(object[key])]: object,
  }), {})
);
