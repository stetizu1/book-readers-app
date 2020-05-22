import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from 'app/constants/style/Colors';


export const useToggleFormItemStyle = makeStyles({
  switch: {
    '& .MuiSwitch-thumb': {
      color: CssThemeColor.blue,
    },
    '& .Mui-checked .MuiSwitch-thumb': {
      color: CssThemeColor.lighterBlue,
    },
    '& .Mui-checked + .MuiSwitch-track': {
      backgroundColor: CssThemeColor.lightBlue,
    },
  },
  tooltip: {
    fontSize: '15px',
    lineHeight: '1.3em',
  },
});
