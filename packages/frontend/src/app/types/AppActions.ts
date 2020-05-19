import { DialogAction } from 'app/modules/dialog/dialogAction';

import { BookLoanAction } from 'app/modules/book-loan/bookLoanAction';
import { FriendsDataAction } from 'app/modules/friends-data/friendsDataAction';
import { FriendshipAction } from 'app/modules/friendship/friendshipAction';
import { LoginAction } from 'app/modules/login/loginAction';
import { LibraryAction } from 'app/modules/library/libraryAction';
import { UserAction } from 'app/modules/user/userAction';
import { WishlistAction } from 'app/modules/wishlist/wishlistAction';


export type AppActions = (
  DialogAction
  | BookLoanAction
  | FriendsDataAction
  | FriendshipAction
  | LoginAction
  | LibraryAction
  | UserAction
  | WishlistAction
);
