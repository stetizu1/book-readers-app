import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssButtonColors, CssButtonHoverColors } from 'app/constants/style/Colors';


export const useButtonStyle = makeStyles({
  save: {
    backgroundColor: CssButtonColors.save,
    '&:hover': {
      color: CssButtonHoverColors.saveText,
      backgroundColor: CssButtonHoverColors.save,
    },
  },
  detail: {
    backgroundColor: CssButtonColors.detail,
    '&:hover': {
      color: CssButtonHoverColors.detailText,
      backgroundColor: CssButtonHoverColors.detail,
    },
  },
  edit: {
    color: CssFontColor.blue,
    backgroundColor: CssButtonColors.edit,
    '&:hover': {
      color: CssButtonHoverColors.editText,
      backgroundColor: CssButtonHoverColors.edit,
    },
  },
  deleteButton: {
    color: CssButtonColors.deleteButtonText,
    backgroundColor: CssButtonColors.deleteButton,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteButtonText,
      backgroundColor: CssButtonHoverColors.deleteButton,
    },
  },
  deleteOption: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: CssButtonHoverColors.delete,
    },
  },
  cancel: {
    color: CssButtonColors.cancelText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.cancelText,
      backgroundColor: CssButtonHoverColors.cancel,
    },
  },
  logout: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: 'transparent',
    },
  },
});
