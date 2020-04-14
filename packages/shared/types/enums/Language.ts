import { isString } from '../../helpers/typeChecks';

export enum Language {
  czech = 'cz',
}

export const isLanguage = (test: unknown): test is Language => (
  isString(test)
  && test in Language
);
