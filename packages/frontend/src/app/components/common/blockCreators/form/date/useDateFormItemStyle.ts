import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from 'app/constants/style/Colors';

export const useDateFormItemStyle = makeStyles({
  dateContainer: {
    '& label + .MuiInput-formControl': {
      margin: '5px 0',
    },
    '& input': {
      backgroundColor: CssThemeColor.greyBlue,
    },
    '& .MuiInput-underline': {
      border: `1px solid ${CssThemeColor.lightBlue}`,
      borderRadius: '5px',
      padding: '12px 0 12px 12px',
      '&:hover': {
        borderColor: CssThemeColor.lighterBlue,
        '& .MuiIconButton-label': {
          color: CssThemeColor.lighterBlue,
        },
      },
      '&.Mui-focused': {
        borderColor: CssThemeColor.lighterBlue,
      },
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none !important',
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none !important',
    },
    '& label': {
      marginLeft: '8px',
      marginTop: '-6px',
      zIndex: 100,
      padding: '5px',
      backgroundColor: CssThemeColor.greyBlue,
    },
    '& .MuiIconButton-label': {
      color: CssThemeColor.lightBlue,
    },
    '& .Mui-focused .MuiIconButton-label': {
      color: CssThemeColor.lighterBlue,
    },
  },
});
