import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useGridStyle = makeStyles({
  paper: {
    width: '100%',
    margin: '10px 0',
    maxWidth: '500px',
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
  gridContainer: {
    padding: '10px 20px',
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  columnLeft: {
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '60%',
  },
  columnRight: {
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '40%',
  },
});
