import { makeStyles } from '@material-ui/core/styles';

import { ButtonType } from 'app/constants/style/types/ButtonType';
import { CssFontColor, CssButtonColors, CssButtonHoverColors } from 'app/constants/style/Colors';


export const useButtonsStyle = makeStyles({
  [ButtonType.button]: {
    backgroundColor: CssButtonColors.detail,
    '&:hover': {
      color: CssButtonHoverColors.detailText,
      backgroundColor: CssButtonHoverColors.detail,
    },
  },
  [ButtonType.save]: {
    backgroundColor: CssButtonColors.save,
    '&:hover': {
      color: CssButtonHoverColors.saveText,
      backgroundColor: CssButtonHoverColors.save,
    },
  },
  [ButtonType.edit]: {
    color: CssFontColor.blue,
    backgroundColor: CssButtonColors.edit,
    '&:hover': {
      color: CssButtonHoverColors.editText,
      backgroundColor: CssButtonHoverColors.edit,
    },
  },
  [ButtonType.delete]: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: CssButtonHoverColors.delete,
    },
  },
  [ButtonType.dialogDelete]: {
    color: CssButtonColors.deleteButtonText,
    backgroundColor: CssButtonColors.deleteButton,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteButtonText,
      backgroundColor: CssButtonHoverColors.deleteButton,
    },
  },
  [ButtonType.cancel]: {
    color: CssButtonColors.cancelText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.cancelText,
      backgroundColor: CssButtonHoverColors.cancel,
    },
  },
  [ButtonType.logout]: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: 'transparent',
    },
  },
});
