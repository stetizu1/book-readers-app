export const isValidDate = (test: unknown): boolean => {
  if (!(typeof test === 'string' || typeof test === 'number')) {
    console.error(`Value can not be parsed as a Date: ${test}`);
    return false;
  }
  const date = new Date(test);
  if (Number.isNaN(date.getDate())) {
    console.error(`Invalid date created: ${test}`);
    return false;
  }
  return true;
};

export const isValidName = (name: string): boolean => name.length !== 0;

export const isValidId = (id: number): boolean => Number.isInteger(id) && id >= 0;
