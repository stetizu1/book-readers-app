import { ButtonType } from '../constants/style/types/ButtonType';

export enum ButtonMessage {
  Detail = 'Podrobnosti',

  Save = 'Uložit',
  Edit = 'Editovat',
  Delete = 'Odstranit',

  Confirm = 'Potvrdit',
  DialogCancel = 'Zrušit',

  LogoutText = 'Odhlásit se',

  Back = 'Zpět',
  Search = 'Vyhledat',
  Wishlist = 'Wishlist',

  LoginText = 'Přihlásit se',
  RegisterText = 'Zaregistrovat se',
  BookBookRequest = 'Zamluvit',
  UnbookBookRequest = 'Zrušit zamluvení',

  ToFriends = 'Zobrazit přátele',

  ToLibrary = 'Přejít do knihovny',
  ToWishlist = 'Přejít do wishlistu',
  ToBorrowed = 'Přejít do půjčených knih',
  ToBookLoan = 'Přejít do zapůjčených knih',

  AddBook = 'Přidat knihu',
  AddLoan = 'Přidat zapůjčení knihy',
  AddLabel = 'Přidat štítek',
  AddFriend = 'Přidat přítele',
  AddBookRequest = 'Přidat přání',
  AddBookRequestToFriend = 'Přidat dárek příteli',
  RequestFriends = 'Požádat o přátelství',

  ReturnBook = 'Vrátit',
  DeleteProfile = 'Odstranit profil',

  ToBookedBookRequests = 'Na zamluvené knihy',
  BackToWishlist = 'Zpět na wishlist',

  Labels = 'Správa štítků',
  BackToLibrary = 'Zpět do knihovny',

  ToOwnReviews = 'Vlastní recenze',
  BackToFriendsReviews = 'Zpět na recenze přátel',
  Borrowed = 'Půjčené knihy',
  BackToBookLoan = 'Zpět na zapůjčené knihy',
}

export const DefaultButtonMessage = {
  [ButtonType.button]: ButtonMessage.Detail,

  [ButtonType.save]: ButtonMessage.Save,
  [ButtonType.edit]: ButtonMessage.Edit,
  [ButtonType.delete]: ButtonMessage.Delete,

  [ButtonType.dialogDelete]: ButtonMessage.Confirm,
  [ButtonType.cancel]: ButtonMessage.DialogCancel,

  [ButtonType.logout]: ButtonMessage.LogoutText,

};
