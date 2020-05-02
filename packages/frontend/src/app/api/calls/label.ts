import { Label, LabelCreate, LabelUpdate } from 'book-app-shared/types/Label';
import { LabelPath } from 'book-app-shared/paths/LabelPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiLabel {
  post: ApiPost<LabelCreate, Label>;
  get: ApiGet<Label>;
  put: ApiPut<LabelUpdate, Label>;
  delete: ApiDelete<Label>;
  getAll: ApiGetAll<Label>;
}

export const apiLabel: ApiLabel = {
  post: apiCall.post(LabelPath.post),
  get: apiCall.get(LabelPath.get),
  put: apiCall.put(LabelPath.put),
  delete: apiCall.delete(LabelPath.delete),
  getAll: apiCall.getAll(LabelPath.getAll),
};
