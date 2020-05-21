import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useIconCardStyle = makeStyles({
  paper: {
    width: '100%',
    margin: '10px 0',
    maxWidth: '500px',
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: '15px 0 30px',
  },
  imageLeft: {
    padding: '0 5px 0 20px',
    fontSize: '50px',
  },
  imageRight: {
    padding: '0 20px 0 5px',
    fontSize: '50px',
  },
});
