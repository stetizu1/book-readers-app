import { starsNumber } from '../constants/stars';

// eslint-disable-next-line no-useless-escape
export const emailRegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
export const isbnRegExp = new RegExp(/^(?:\d{9}[\dXx]|\d{13})$/);
export const yearRegExp = new RegExp(/^[12][0-9]{3}$/);

export const isValidId = (id: number): boolean => Number.isInteger(id) && id >= 0;

export const isValidName = (name: string): boolean => name.length !== 0;

export const isValidEmail = (email: string): boolean => emailRegExp.test(email);

export const isValidDate = (date: string): boolean => {
  const dateCreated = new Date(date);
  return !Number.isNaN(dateCreated.getDate());
};

export const isValidYear = (year: string): boolean => yearRegExp.test(year);


export const isValidIsbn = (isbn: string): boolean => {
  if (isbnRegExp.test(isbn)) {
    const last = isbn.slice(-1);
    const numsWithoutLast = isbn.slice(0, -1).split('').map(Number);

    const lastDigit = (last !== 'X') ? parseInt(last, 10) : 'X';

    const mapped = numsWithoutLast.map((num, index) => num * (index + 1));

    const sum = mapped.reduce((num1, num2) => num1 + num2, 0);

    const controlDigit = sum % 11;
    return lastDigit === (controlDigit !== 10 ? controlDigit : 'X');
  }
  return false;
};

export const isValidStars = (stars: number): boolean => stars >= starsNumber.min && stars <= starsNumber.max;

const isNotEmptyValue = <T>(val: T): boolean => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val !== '';
  return true;
};

export const isNotEmptyObject = (obj: object): boolean => Object.values(obj).some(isNotEmptyValue);
