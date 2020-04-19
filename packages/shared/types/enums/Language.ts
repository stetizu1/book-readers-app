import { isString, typeCheckFactory, TypeCheckFunction } from '../../helpers/typeChecks';

export enum Language {
  czech = 'cz',
}

export const isLanguage: TypeCheckFunction<Language> = typeCheckFactory(
  (test): test is Language => (
    isString(test)
    && test in Language
  ),
);
