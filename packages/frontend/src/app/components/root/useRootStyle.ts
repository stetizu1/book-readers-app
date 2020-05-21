import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useRootStyle = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    textAlign: 'left',
    position: 'relative',
    color: CssFontColor.blue,
    background: CssThemeColor.blue,
    '& a': {
      color: `${CssFontColor.yellow}`,
    },
    '& a:hover': {
      color: `${CssFontColor.darkYellow}`,
    },
  },
  body: {
    width: '960px',
    alignSelf: 'center',
    background: CssThemeColor.yellow,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10,
  },
});
