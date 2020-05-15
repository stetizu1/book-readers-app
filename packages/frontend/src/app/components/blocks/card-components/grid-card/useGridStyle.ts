import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from '../../../../constants/style/Colors';


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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& > *': {
      flexWrap: 'nowrap',
    },
  },
});
