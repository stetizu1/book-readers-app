import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useRootStyle = makeStyles({
  page: {
    color: CssFontColor.blue,
    background: CssThemeColor.blue,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    position: 'relative',
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
  },
});
