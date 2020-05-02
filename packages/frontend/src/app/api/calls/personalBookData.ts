import {
  PersonalBookData,
  PersonalBookDataCreate,
  PersonalBookDataUpdate,
} from 'book-app-shared/types/PersonalBookData';
import { PersonalBookDataPath } from 'book-app-shared/paths/PersonalBookDataPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiPersonalBookData {
  post: ApiPost<PersonalBookDataCreate, PersonalBookData>;
  get: ApiGet<PersonalBookData>;
  put: ApiPut<PersonalBookDataUpdate, PersonalBookData>;
  delete: ApiDelete<PersonalBookData>;
}

export const apiPersonalBookData: ApiPersonalBookData = {
  post: apiCall.post(PersonalBookDataPath.post),
  get: apiCall.get(PersonalBookDataPath.get),
  put: apiCall.put(PersonalBookDataPath.put),
  delete: apiCall.delete(PersonalBookDataPath.delete),
};
