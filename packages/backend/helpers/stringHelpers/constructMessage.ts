import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ErrorMethodMessage, ErrorParamGivenMessage, PostfixMessage } from '../../constants/ErrorMessages';

/**
 * Connects given arguments with whitespace separator.
 * @param args - string or undefined values to join.
 */
export const composeMessage = (...args: (string | undefined)[]): string => (
  args
    .filter((arg) => !isUndefined(arg))
    .join(' ')
);

type ErrPrefixAndPostfix = {
  errPrefix: string;
  errPostfix: string;
};

interface GetErrorPrefixAndPostfix {
  create: (repoName: string, body: unknown) => ErrPrefixAndPostfix;
  read: (repoName: string, param: string) => ErrPrefixAndPostfix;
  readAll: (repoName: string) => ErrPrefixAndPostfix;
  update: (repoName: string, param: string, body: unknown) => ErrPrefixAndPostfix;
  delete: (repoName: string, param: string) => ErrPrefixAndPostfix;
  deleteWithBody: (repoName: string, body: unknown) => ErrPrefixAndPostfix;
}

/**
 * Returns prefix and postfix for errors generated depending on required method. Prefix and postfix are used for better orientation where error occurred.
 */
export const getErrorPrefixAndPostfix: GetErrorPrefixAndPostfix = {
  create: (repoName, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Create),
    errPostfix: composeMessage(ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  read: (repoName, param) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Read),
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, String(param)),
  }),

  readAll: (repoName) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.ReadAll),
    errPostfix: '',
  }),

  update: (repoName, param, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Update),
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, String(param), ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  delete: (repoName, param) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, String(param)),
  }),

  deleteWithBody: (repoName, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),
};
