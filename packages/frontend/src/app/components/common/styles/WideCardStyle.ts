import { makeStyles } from '@material-ui/core/styles';


export const useWideCardStyle = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'left',
    width: '100%',
    '& > *': {
      maxWidth: '500px',
      flexGrow: 1,
      justifyContent: 'center',
      '& > *': {
        maxWidth: '500px',
      },
    },
  },
});
