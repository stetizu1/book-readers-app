import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useFormItemStyle = makeStyles({
  item: {
    width: 'calc(100% - 8px)',
    padding: '8px',
    '& label': {
      color: CssFontColor.lightBlue,
    },
    '& input': {
      background: CssThemeColor.blue,
      color: CssFontColor.lightBlue,
      borderRadius: '5px',
    },
    '& label.Mui-focused': {
      color: CssFontColor.lighterBlue,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: CssThemeColor.lightBlue,
      },
      '&:hover fieldset': {
        borderColor: CssThemeColor.lighterBlue,
      },
      '&.Mui-focused fieldset': {
        borderColor: CssThemeColor.lighterBlue,
      },
    },
  },
  readOnly: {
    padding: '4px 8px',
    '& input': {
      padding: '10px 15px !important',
    },
    '& label': {
      color: `${CssFontColor.greyLightBlue} !important`,
    },
    '&:hover fieldset': {
      borderColor: 'inherit !important',
    },
  },
  switchBase: {
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
});
