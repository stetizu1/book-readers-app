import { makeStyles } from '@material-ui/core/styles';
import { CssButtonColors, CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useFormItemStyle = makeStyles({
  item: {
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
  select: {
    width: '210px',
    color: CssFontColor.lightBlue,
    '& option': {
      color: 'initial',
    },
  },
  multiSelect: {
    border: `1px solid ${CssThemeColor.lightBlue}`,
    borderRadius: '5px',
    padding: '5px',
    '&:hover': {
      borderColor: CssThemeColor.lighterBlue,
    },
    '&:before': {
      borderBottom: 'none !important',
    },
    '& > *': {
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      height: 'auto',
    },
    '& .MuiChip-root': {
      padding: 0,
    },
  },
  checkIcon: {
    fontSize: '15px',
    color: CssButtonColors.save,
  },
});
