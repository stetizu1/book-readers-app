import { Friendship, FriendshipCreate, FriendshipUpdate } from 'book-app-shared/types/Friendship';
import { FriendshipPath } from 'book-app-shared/paths/FriendshipPath';

import {
  ApiPost,
  ApiGet,
  ApiPut,
  ApiDelete,
  ApiGetAll,
} from 'app/types/ApiTypes';

import { apiCall } from '../apiCalls';


interface ApiFriendship {
  post: ApiPost<FriendshipCreate, Friendship>;
  get: ApiGet<Friendship>;
  put: ApiPut<FriendshipUpdate, Friendship>;
  delete: ApiDelete<Friendship>;
  getAll: ApiGetAll<Friendship>;
}

export const apiFriendship: ApiFriendship = {
  post: apiCall.post(FriendshipPath.post),
  get: apiCall.get(FriendshipPath.get),
  put: apiCall.put(FriendshipPath.put),
  delete: apiCall.delete(FriendshipPath.delete),
  getAll: apiCall.getAll(FriendshipPath.getAll),
};
