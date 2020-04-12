export const isValidId = (id: number): boolean => Number.isInteger(id) && id >= 0;

export const isValidName = (name: string): boolean => name.length !== 0;

export const isValidEmail = (email: string): boolean => {
  // eslint-disable-next-line no-useless-escape
  const re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  return re.test(email);
};

export const isValidDate = (test: string): boolean => {
  const date = new Date(test);
  return !Number.isNaN(date.getDate());
};
