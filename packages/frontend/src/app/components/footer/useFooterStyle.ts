import { makeStyles } from '@material-ui/core/styles';

import {
  CssFontColor, CssThemeColor, CssThemeTransparentColor,
} from 'app/constants/style/Colors';


export const useFooterStyle = makeStyles({
  footer: {
    background: CssThemeColor.greyBlue,
    border: 0,
    boxShadow: `0 -3px 5px 4px ${CssThemeTransparentColor.greyBlue}`,
    color: CssFontColor.yellow,
    padding: '5px 30px 10px',
    textAlign: 'center',
  },
  href: {
    fontSize: '10px',
  },
});
