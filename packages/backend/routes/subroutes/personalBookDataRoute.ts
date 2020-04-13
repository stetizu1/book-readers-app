import { Application } from 'express';

import { PersonalBookData } from 'book-app-shared/types/PersonalBookData';

import { personalBookData, path } from '../../constants/paths';
import { ActionType } from '../../types/actionTypes';
import { requests } from '../../helpers/express/expressCalls';
import { wrapHandler } from '../../helpers/express/wrapHandler';
import { executeWithContext } from '../../storage_context/executeWithContext';
import { PersonalBookDataRepository } from '../../repositories/PersonalBookDataRepository';


export const startPersonalBookDataRoute = (app: Application): void => {
  requests.post(
    app,
    path.post(personalBookData),
    wrapHandler({
      type: ActionType.Create,
      callAction: executeWithContext.create<PersonalBookData>(PersonalBookDataRepository.createPersonalBookData),
    }),
  );
};
