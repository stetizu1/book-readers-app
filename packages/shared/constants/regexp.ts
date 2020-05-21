import { CapitalsRegExp as Lu, LowercaseRegExp as Ll } from './letters';

const toTsRegExp = (regexp: string): RegExp => RegExp(`^${regexp}$`);

/* eslint-disable no-useless-escape */
export const htmlRegExp = {
  email: '[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}',
  isbn: '(?:\\d{9}[\\dXx]|\\d{13})',
  year: '[12][0-9]{3}',
  name: `[${Lu}${Ll}][${Ll}]*[.]?([ -'][${Lu}${Ll}][${Ll}']*[.]?)*`,
};

export const tsRegExp = {
  id: new RegExp(/[1-9]+[0-9]*/),
  email: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
  isbn: toTsRegExp(htmlRegExp.isbn),
  year: toTsRegExp(htmlRegExp.year),
  name: toTsRegExp(htmlRegExp.name),
  databaseUrl: new RegExp(/^(?:([^:/?#\s]+):\/{2})?(?:([^@/?#\s]+)@)?([^/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/),
  googleClientId: new RegExp(/^[0-9]+[-][0-9a-z]+\.apps\.googleusercontent\.com$/),
  date: new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\+[0-9]{4}$/), // has to correspond to DataFormat.date
};
