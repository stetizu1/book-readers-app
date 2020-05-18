import { combineReducers, Reducer } from 'redux';

import { AppState } from 'app/types/AppState';
import { AppActions } from 'app/types/AppActions';

import { LoginActionName } from 'app/constants/action-names/login';

import { dialogReducer } from './dialog/dialogReducer';
import { userReducer } from './user/userReducer';
import { bookLoanReducer } from './book-loan/bookLoanReducer';
import { friendshipReducer } from './friendship/friendshipReducer';
import { libraryReducer } from './library/libraryReducer';
import { loginReducer } from './login/loginReducer';
import { wishlistReducer } from './wishlist/wishlistReducer';


const appReducer: Reducer<AppState, AppActions> = combineReducers({
  dialogState: dialogReducer,

  bookLoanState: bookLoanReducer,
  friendshipState: friendshipReducer,
  libraryState: libraryReducer,
  loginState: loginReducer,
  userState: userReducer,
  wishlistState: wishlistReducer,
});

export const rootReducer: Reducer<AppState, AppActions> = (state, action) => {
  if (action.type === LoginActionName.LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};
