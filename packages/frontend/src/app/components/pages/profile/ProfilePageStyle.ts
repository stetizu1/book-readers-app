import { makeStyles } from '@material-ui/core/styles';


export const useProfilePageStyle = makeStyles({
  container: {
    '& > *': {
      justifyContent: 'center',
      '& > *': {
        maxWidth: '500px',
      },
    },
  },
});
