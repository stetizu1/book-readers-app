import { PostgreSqlErrorCode } from '../../constants/PostgreSqlErrorCode';

export interface PostgreSqlError extends Error {
  code: PostgreSqlErrorCode;
}

export const isPostgreSqlError = (e: Error): e is PostgreSqlError => 'code' in e;
