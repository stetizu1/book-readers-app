import { makeStyles } from '@material-ui/core/styles';

import {
  CssFontColor, CssThemeColor, CssThemeTransparentColor,
} from 'app/constants/style/Colors';


export const useMenuStyle = makeStyles({
  menu: {
    background: CssThemeColor.greyYellow,
    border: 0,
    color: CssFontColor.blue,
    padding: '5px 0 0',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    boxShadow: `0 5px 5px 0 ${CssThemeTransparentColor.greyYellow}`,
    '& button': {
      background: CssThemeColor.greyYellow,
      transition: 'background 0.2s',
    },
    '& button:hover': {
      background: CssThemeColor.darkYellow,
    },
  },
  indicator: {
    backgroundColor: CssThemeColor.lightBlue,
  },
});
