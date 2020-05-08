import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useCardItemStyle = makeStyles({
  bold: {
    fontWeight: 'bold',
  },
  item: {
    padding: '2px 8px',
    display: 'flex',
  },
  label: {
    background: CssThemeColor.lighterBlue,
    color: CssFontColor.blue,
    borderRadius: '10px',
    padding: '1px 6px',
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 'small',
  },
});