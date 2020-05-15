import { makeStyles } from '@material-ui/core/styles';
import { ButtonLayoutType } from '../../../../constants/style/types/ButtonLayoutType';


const common = {
  display: 'flex',
  padding: '10px 10px 15px',
  '& > *': {
    margin: '0 10px 10px',
  },
};

export const useButtonsLayoutStyle = makeStyles({
  [ButtonLayoutType.adjacent]: {
    ...common,
    justifyContent: 'flex-end',
  },
  [ButtonLayoutType.opposite]: {
    ...common,
    justifyContent: 'space-between',
    marginTop: '50px',
  },
});
