import { Label, LabelCreate, LabelUpdate } from 'book-app-shared/types/Label';
import { LabelPath } from 'book-app-shared/paths/LabelPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiLabel {
  post: ApiPostAuthorized<LabelCreate, Label>;
  get: ApiGetAuthorized<Label>;
  put: ApiPutAuthorized<LabelUpdate, Label>;
  delete: ApiDeleteAuthorized<Label>;
  getAll: ApiGetAllAuthorized<Label>;
}

export const apiLabel: ApiLabel = {
  post: apiAuthorized.post(LabelPath.post),
  get: apiAuthorized.get(LabelPath.get),
  put: apiAuthorized.put(LabelPath.put),
  delete: apiAuthorized.delete(LabelPath.delete),
  getAll: apiAuthorized.getAll(LabelPath.getAll),
};
