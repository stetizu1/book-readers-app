import { makeStyles } from '@material-ui/core/styles';

import {
  CssFontColor, CssOtherColors, CssThemeColor, CssThemeTransparentColor,
} from '../../constants/Css';


export const useHeaderStyle = makeStyles({
  header: {
    background: CssThemeColor.greyBlue,
    border: 0,
    boxShadow: `0 5px 7px 4px ${CssThemeTransparentColor.greyBlue}`,
    color: CssFontColor.yellow,
    padding: '10px 30px 5px',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
  },
  logout: {
    color: CssOtherColors.logoutFont,
    fontSize: 'small',
  },
  headerIcon: {
    padding: '0 20px',
    fontSize: '40px',
  },
  headerLogo: {
    display: 'flex',
    alignItems: 'center',
  },
  emptySpace: {
    flexGrow: 1,
  },
});
