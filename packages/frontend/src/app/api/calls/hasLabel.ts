import { HasLabel } from 'book-app-shared/types/HasLabel';
import { HasLabelPath } from 'book-app-shared/paths/HasLabelPath';

import {
  ApiPost,
  ApiGet,
  ApiDelete,
} from '../../types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiHasLabel {
  post: ApiPost<HasLabel, HasLabel>;
  get: ApiGet<HasLabel>;
  delete: ApiDelete<HasLabel>;
}

export const apiHasLabel: ApiHasLabel = {
  post: apiCall.post(HasLabelPath.post),
  get: apiCall.get(HasLabelPath.get),
  delete: apiCall.delete(HasLabelPath.delete),
};
