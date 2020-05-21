import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useDoubleCardStyle = makeStyles({
  paper: {
    width: '100%',
    margin: '10px 0',
    maxWidth: '500px',
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  sideBySide: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    padding: '0 10px',
    width: 'calc(50% - 20px)',
    margin: '10px',
    borderRadius: '10px',
    backgroundColor: CssThemeColor.blue,
  },
});
