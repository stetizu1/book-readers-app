export const composeArrays = <T>(arrays: T[][]): T[] => (
  arrays.reduce((resultArray, array) => [
    ...resultArray, ...array,
  ], [])
);
