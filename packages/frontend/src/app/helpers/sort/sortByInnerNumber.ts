export const sortByInnerNumber = <T extends {}>(key: keyof T) => (t1: T, t2: T): number => Number(t2[key]) - Number(t1[key]);
