import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from 'app/constants/style/Colors';


const toggleFormItemStyle = {
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
};

export const useToggleFormItemStyle = makeStyles(toggleFormItemStyle);
