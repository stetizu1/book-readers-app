import { DialogState } from 'app/modules/dialog/dialogReducer';
import { LoginState } from 'app/modules/login/loginReducer';
import { UserState } from 'app/modules/user/userReducer';
import { LibraryState } from 'app/modules/library/libraryReducer';
import { FriendshipState } from '../modules/friendship/friendshipReducer';
import { WishlistState } from '../modules/wishlist/wishlistReducer';
import { BookLoanState } from '../modules/book-loan/bookLoanReducer';


export type AppState = {
  dialogState: DialogState;

  bookLoanState: BookLoanState;
  friendshipState: FriendshipState;
  libraryState: LibraryState;
  loginState: LoginState;
  userState: UserState;
  wishlistState: WishlistState;
};
