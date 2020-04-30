import {
  PersonalBookData,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { PersonalBookDataPath } from 'book-app-shared/paths/PersonalBookDataPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiPersonalBookData {
  post: ApiPostAuthorized<PersonalBookDataCreate, PersonalBookData>;
  get: ApiGetAuthorized<PersonalBookData>;
  put: ApiPutAuthorized<PersonalBookDataUpdate, PersonalBookData>;
  delete: ApiDeleteAuthorized<PersonalBookData>;
}

export const apiPersonalBookData: ApiPersonalBookData = {
  post: apiAuthorized.post(PersonalBookDataPath.post),
  get: apiAuthorized.get(PersonalBookDataPath.get),
  put: apiAuthorized.put(PersonalBookDataPath.put),
  delete: apiAuthorized.delete(PersonalBookDataPath.delete),
};
