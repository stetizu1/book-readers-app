import { TypeCheckFunction } from 'book-app-shared/helpers/typeChecks';
import { InvalidParametersErrorMessage, Success } from '../../constants/ErrorMessages';
import { CheckFunction } from '../../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../db/normalizeStructure';
import { InvalidParametersError } from '../../types/http-errors/InvalidParametersError';

const checkMultiple = <T extends object>(checks: CheckFunction<T>[], body: T): InvalidParametersErrorMessage | Success.checkSuccess => (
  checks
    .map((check) => check(body))
    .find((res) => (res !== Success.checkSuccess))
  || Success.checkSuccess
);

const executeCheck = <T extends object>(
  normalized: unknown,
  typeCheck: TypeCheckFunction<T>,
  check: CheckFunction<T>[],
): T => {
  if (typeCheck(normalized)) {
    const result = checkMultiple(check, normalized);
    if (result === Success.checkSuccess) {
      return normalized;
    }
    throw new InvalidParametersError(result);
  }
  throw new InvalidParametersError(InvalidParametersErrorMessage.invalidType);
};

/**
 * Normalizes given body to create, executes given type check and then given check.
 * Returns value of type required from type check or throws invalid parameters error.
 * @param createBody - tested bodys
 * @param typeCheck - function checking if body has the right type
 * @param check - ...functions checking if body has valid values
 */
export const executeCheckCreate = <T extends object>(
  createBody: unknown,
  typeCheck: TypeCheckFunction<T>,
  ...check: CheckFunction<T>[]
): T => {
  const normalized = normalizeCreateObject(createBody);
  return executeCheck(normalized, typeCheck, check);
};

/**
 * Normalizes given body to update, executes given type check and then given check.
 * Returns value of type required from type check or throws invalid parameters error.
 * @param updateBody - tested body
 * @param typeCheck - function checking if body has the right type
 * @param check - ...functions checking if body has valid values
 */
export const executeCheckUpdate = <T extends object>(
  updateBody: unknown,
  typeCheck: TypeCheckFunction<T>,
  ...check: CheckFunction<T>[]
): T => {
  const normalized = normalizeUpdateObject(updateBody);
  return executeCheck(normalized, typeCheck, check);
};
