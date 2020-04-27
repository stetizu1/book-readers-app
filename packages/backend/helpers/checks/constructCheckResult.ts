import { TypeCheckFunction } from 'book-app-shared/helpers/typeChecks';
import { CheckResultMessage } from '../../constants/ErrorMessages';
import { CheckFunction } from '../../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../db/normalizeStructure';
import { getHttpError } from '../errors/getHttpError';

const checkMultiple = <T>(checks: CheckFunction<T>[], body: T): CheckResultMessage => (
  checks
    .map((check) => check(body))
    .find((res) => (res !== CheckResultMessage.success))
  || CheckResultMessage.success
);

const executeCheck = <T>(
  normalized: unknown,
  errPrefix: string,
  errPostfix: string,
  typeCheck: TypeCheckFunction<T>,
  check: CheckFunction<T>[],
): T => {
  if (typeCheck(normalized)) {
    const result = checkMultiple(check, normalized);
    if (result === CheckResultMessage.success) {
      return normalized;
    }
    throw getHttpError.getInvalidParametersError(result, errPrefix, errPostfix);
  }
  throw getHttpError.getInvalidParametersError(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

/**
 * Normalizes given body to create, executes given type check and then given check.
 * Returns value of type required from type check or throws invalid parameters error.
 * @param createBody - tested body
 * @param errPrefix - prefix for error
 * @param errPostfix - postfix for error
 * @param typeCheck - function checking if body has the right type
 * @param check - ...functions checking if body has valid values
 */
export const executeCheckCreate = <T>(
  createBody: unknown,
  errPrefix: string,
  errPostfix: string,
  typeCheck: TypeCheckFunction<T>,
  ...check: CheckFunction<T>[]
): T => {
  const normalized = normalizeCreateObject(createBody);
  return executeCheck(normalized, errPrefix, errPostfix, typeCheck, check);
};

/**
 * Normalizes given body to update, executes given type check and then given check.
 * Returns value of type required from type check or throws invalid parameters error.
 * @param updateBody - tested body
 * @param errPrefix - prefix for error
 * @param errPostfix - postfix for error
 * @param typeCheck - function checking if body has the right type
 * @param check - ...functions checking if body has valid values
 */
export const executeCheckUpdate = <T>(
  updateBody: unknown,
  errPrefix: string,
  errPostfix: string,
  typeCheck: TypeCheckFunction<T>,
  ...check: CheckFunction<T>[]
): T => {
  const normalized = normalizeUpdateObject(updateBody);
  return executeCheck(normalized, errPrefix, errPostfix, typeCheck, check);
};
