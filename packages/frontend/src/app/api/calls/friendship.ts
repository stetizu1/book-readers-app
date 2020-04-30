import { Friendship, FriendshipCreate, FriendshipUpdate } from 'book-app-shared/types/Friendship';
import { FriendshipPath } from 'book-app-shared/paths/FriendshipPath';

import {
  ApiPostAuthorized,
  ApiGetAuthorized,
  ApiPutAuthorized,
  ApiDeleteAuthorized,
  ApiGetAllAuthorized,
} from '../../types/ApiTypes';

import { apiAuthorized } from '../apiCalls';


interface ApiFriendship {
  post: ApiPostAuthorized<FriendshipCreate, Friendship>;
  get: ApiGetAuthorized<Friendship>;
  put: ApiPutAuthorized<FriendshipUpdate, Friendship>;
  delete: ApiDeleteAuthorized<Friendship>;
  getAll: ApiGetAllAuthorized<Friendship>;
}

export const apiFriendship: ApiFriendship = {
  post: apiAuthorized.post(FriendshipPath.post),
  get: apiAuthorized.get(FriendshipPath.get),
  put: apiAuthorized.put(FriendshipPath.put),
  delete: apiAuthorized.delete(FriendshipPath.delete),
  getAll: apiAuthorized.getAll(FriendshipPath.getAll),
};
