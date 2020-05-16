import { ButtonType } from '../constants/style/types/ButtonType';

export enum ButtonMessage {
  Detail = 'Podrobnosti',

  Save = 'Uložit',
  Edit = 'Editovat',
  Delete = 'Odstranit',

  confirm = 'Potvrdit',
  DialogCancel = 'Zrušit',

  LogoutText = 'Odhlásit se',

  back = 'Zpět',
  LoginText = 'Přihlásit se',
  RegisterText = 'Zaregistrovat se',
  DeleteProfile = 'Odstranit profil',
  Labels = 'Správa štítků',
  AddBook = 'Přidat knihu',
  AddLabel = 'Přidat štítek',
  AddFriend = 'Přidat přítele',
}

export const DefaultButtonMessage = {
  [ButtonType.button]: ButtonMessage.Detail,

  [ButtonType.save]: ButtonMessage.Save,
  [ButtonType.edit]: ButtonMessage.Edit,
  [ButtonType.delete]: ButtonMessage.Delete,

  [ButtonType.dialogDelete]: ButtonMessage.confirm,
  [ButtonType.cancel]: ButtonMessage.DialogCancel,

  [ButtonType.logout]: ButtonMessage.LogoutText,

};
