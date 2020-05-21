import { starsCount } from '../constants/Stars';
import {
  tsRegExp,
} from '../constants/regexp';
import { isString } from './typeChecks';


export const isValidId = (test: number | string): boolean => {
  if (isString(test)) {
    return tsRegExp.id.test(test);
  }
  return Number.isInteger(test) && test > 0;
};

export const isValidName = (name: string): boolean => tsRegExp.name.test(name);

export const isValidEmail = (email: string): boolean => tsRegExp.email.test(email);

export const isValidDate = (date: string): boolean => {
  const dateCreated = new Date(date);
  return !Number.isNaN(dateCreated.getDate());
};

export const isValidYear = (year: string): boolean => tsRegExp.year.test(year);

export const isValidIsbn = (isbn: string): boolean => tsRegExp.isbn.test(isbn);

export const isValidStarsCount = (stars: number): boolean => stars >= starsCount.min && stars <= starsCount.max;

export const isValidPort = (port: string): boolean => {
  const portNum = Number(port);
  return Number.isInteger(portNum) && portNum >= 0 && portNum < 65535;
};

export const isEmptyString = (string: string): boolean => string === '';

export const isEmptyObject = <T extends {}>(object: T): boolean => !Object.keys(object).length;
