import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useCardItemStyle = makeStyles({
  bold: {
    fontWeight: 'bold',
  },
  item: {
    padding: '2px 8px',
  },
  itemContainer: {
    marginTop: '4px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  label: {
    background: CssThemeColor.lighterBlue,
    color: CssFontColor.blue,
    borderRadius: '10px',
    padding: '3px 8px !important',
    margin: '1px 2px',
    height: 'auto',
    fontSize: '14px',

    '& > *': {
      padding: 0,
    },
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: '0.9em',
    paddingTop: '3px',
  },
});
