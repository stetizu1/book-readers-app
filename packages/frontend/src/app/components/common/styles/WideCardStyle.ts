import { makeStyles } from '@material-ui/core/styles';


export const useWideCardStyle = makeStyles({
  container: {
    '& > *': {
      justifyContent: 'center',
      '& > *': {
        maxWidth: '500px',
      },
    },
  },
});
