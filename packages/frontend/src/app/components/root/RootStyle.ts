import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from '../../constants/Css';


export const useRootStyle = makeStyles({
  page: {
    color: CssFontColor.blue,
    background: CssThemeColor.blue,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  body: {
    width: '960px',
    alignSelf: 'center',
    background: CssThemeColor.yellow,
    flexGrow: 1,
  },
});
