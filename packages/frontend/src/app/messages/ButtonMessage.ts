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
  LoginText = 'Přihlásit se',
  RegisterText = 'Zaregistrovat se',
  DeleteProfile = 'Odstranit profil',
  Labels = 'Správa štítků',
  Borrowed = 'Půjčené knihy',

  ToLibrary = 'Přejít do knihovny',
  AddBook = 'Přidat knihu',
  AddLoan = 'Přidat zapůjčení knihy',
  AddLabel = 'Přidat štítek',
  AddFriend = 'Přidat přítele',
  AddBookRequest = 'Přidat přání',
  RequestFriends = 'Požádat o přátelství',
  BackToLibrary = 'Zpět do knihovny',
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
