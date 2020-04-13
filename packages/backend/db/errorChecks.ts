interface ErrorWithCode extends Error {
  code: string;
}

export const isErrorWithCode = (e: Error): e is ErrorWithCode => 'code' in e;


export const isUniqueViolation = (e: ErrorWithCode): boolean => e.code === '23505';

export const isForeignKeyViolation = (e: ErrorWithCode): boolean => e.code === '23503';
