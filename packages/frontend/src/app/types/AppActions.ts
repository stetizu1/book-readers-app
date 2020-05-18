import { LoginAction } from 'app/modules/login/loginAction';
import { DialogAction } from 'app/modules/dialog/dialogAction';
import { UserAction } from 'app/modules/user/userAction';
import { LibraryAction } from 'app/modules/library/libraryAction';
import { FriendshipAction } from 'app/modules/friendship/friendshipAction';
import { WishlistAction } from 'app/modules/wishlist/wishlistAction';
import { BookLoanAction } from '../modules/book-loan/bookLoanAction';


export type AppActions = (
  DialogAction
  | BookLoanAction
  | FriendshipAction
  | LoginAction
  | LibraryAction
  | UserAction
  | WishlistAction
);
