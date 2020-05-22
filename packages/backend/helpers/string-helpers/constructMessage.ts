import { composeMessage } from 'book-app-shared/helpers/composeMessage';

import { ErrorMethodMessage, ErrorParamGivenMessage, PostfixMessage } from '../../constants/ErrorMessages';


type ErrPrefixAndPostfix = {
  errPrefix: string;
  errPostfix: string;
};

interface GetErrorPrefixAndPostfix {
  create: (repoName: string, body: unknown) => ErrPrefixAndPostfix;
  read: (repoName: string, param: string | number) => ErrPrefixAndPostfix;
  readAll: (repoName: string) => ErrPrefixAndPostfix;
  update: (repoName: string, param: string | number, body: unknown) => ErrPrefixAndPostfix;
  delete: (repoName: string, param: string | number) => ErrPrefixAndPostfix;
  deleteOnTwoParams: (repoName: string, param: string | number, secondParam: string | number) => ErrPrefixAndPostfix;
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
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, param),
  }),

  readAll: (repoName) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.ReadAll),
    errPostfix: '',
  }),

  update: (repoName, param, body) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Update),
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, param, ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  delete: (repoName, param) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Param, param),
  }),

  deleteOnTwoParams: (repoName, param, secondParam) => ({
    errPrefix: composeMessage(repoName, PostfixMessage.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Params, param, secondParam),
  }),
};
