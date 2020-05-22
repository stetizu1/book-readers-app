import { makeStyles } from '@material-ui/core/styles';
import { HeaderType } from '../../../constants/style/types/HeaderType';

const common = {
  maxWidth: '500px',
  padding: '10px 16px 0',
  flexGrow: 1,
};

export const usePageHeaderStyle = makeStyles({
  outside: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  [HeaderType.main]: {
    ...common,
    fontWeight: 'bold',
    fontSize: '2em',
  },
  [HeaderType.subheader]: {
    ...common,
    fontWeight: 'bold',
    fontSize: '1.5em',
  },
});
