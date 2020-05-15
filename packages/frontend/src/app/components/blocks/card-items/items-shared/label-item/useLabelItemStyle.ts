import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


const labelItemStyle = {
  label: {
    borderRadius: '10px',
    background: CssThemeColor.lighterBlue,
    color: CssFontColor.blue,
    padding: '3px 8px',
    margin: '1px 2px',
    fontSize: '14px',
    '& > *': {
      padding: 0,
    },
  },
};

export const useLabelItemStyle = makeStyles(labelItemStyle);
