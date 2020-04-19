import {
  TypeCheckFunction, typeCheckFactory,
  isString,
} from '../../helpers/typeChecks';

export enum Format {
  paperback = 'paperback',
  hardcover = 'hardcover',
  eBook = 'ebook',
  audioBook = 'audiobook',
  other = 'other',
}

export const isFormat: TypeCheckFunction<Format> = typeCheckFactory(
  (test: unknown): test is Format => (
    isString(test)
    && test in Format
  ),
);
