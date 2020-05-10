import { starsCount } from '../constants/Stars';
import {
  emailRegExp, idRegExp, isbnRegExp, nameRegExp, yearRegExp,
} from '../constants/regexp';
import { isString } from './typeChecks';


export const isValidId = (test: number | string): boolean => {
  if (isString(test)) {
    return idRegExp.test(test);
  }
  return Number.isInteger(test) && test > 0;
};

export const isValidName = (name: string): boolean => nameRegExp.test(name);

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

export const isValidStarsCount = (stars: number): boolean => stars >= starsCount.min && stars <= starsCount.max;

export const isValidPort = (port: string): boolean => {
  const portNum = Number(port);
  return Number.isInteger(portNum) && portNum >= 0 && portNum < 65535;
};

export const isEmptyString = (string: string): boolean => string === '';

export const isEmptyObject = <T extends {}>(object: T): boolean => !Object.keys(object).length;
