import { makeStyles } from '@material-ui/core/styles';
import { ButtonLayoutType } from 'app/constants/style/types/ButtonLayoutType';
import { CssThemeTransparentColor } from 'app/constants/style/Colors';


const common = {
  display: 'flex',
  flexGrow: 1,
  padding: '10px 10px 15px',
  '& > *': {
    margin: '0 10px 10px',
  },
};

export const useButtonsLayoutStyle = makeStyles({
  outside: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  [ButtonLayoutType.adjacent]: {
    ...common,
    justifyContent: 'flex-end',
  },
  [ButtonLayoutType.opposite]: {
    ...common,
    justifyContent: 'space-between',
    marginTop: '50px',
  },
  [ButtonLayoutType.outsideAdjacent]: {
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: '500px',
    flexGrow: 1,

    padding: '2px',
    borderRadius: '5px',
    backgroundColor: CssThemeTransparentColor.greyYellow,
    boxShadow: `0 0 5px 4px ${CssThemeTransparentColor.greyYellow}`,
    '& > *': {
      marginLeft: '10px',
    },
  },
});
