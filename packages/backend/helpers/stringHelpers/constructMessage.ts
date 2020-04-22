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
  read: (repoName: string, id: string) => ErrPrefixAndPostfix;
  readAll: (repoName: string) => ErrPrefixAndPostfix;
  update: (repoName: string, id: string, body: unknown) => ErrPrefixAndPostfix;
  delete: (repoName: string, id: string) => ErrPrefixAndPostfix;
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

  read: (repoName, id) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Read),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id)),
  }),

  readAll: (repoName) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.ReadAll),
    errPostfix: '',
  }),

  update: (repoName, id, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Update),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id), ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  delete: (repoName, id) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id)),
  }),

  deleteWithBody: (repoName, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),
};
