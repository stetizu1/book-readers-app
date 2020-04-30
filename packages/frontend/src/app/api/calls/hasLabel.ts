import { HasLabel } from 'book-app-shared/types/HasLabel';
import { HasLabelPath } from 'book-app-shared/paths/HasLabelPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiDeleteAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiHasLabel {
  post: ApiPostAuthorized<HasLabel, HasLabel>;
  get: ApiGetAuthorized<HasLabel>;
  delete: ApiDeleteAuthorized<HasLabel>;
}

export const apiHasLabel: ApiHasLabel = {
  post: apiAuthorized.post(HasLabelPath.post),
  get: apiAuthorized.get(HasLabelPath.get),
  delete: apiAuthorized.delete(HasLabelPath.delete),
};
