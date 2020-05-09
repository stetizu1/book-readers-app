import { makeStyles } from '@material-ui/core/styles';


export const useContainerStyle = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '5px',
    alignItems: 'center',
    textAlign: 'left',
    width: '100%',
    '& > *': {
      maxWidth: '500px',
      flexGrow: 1,
      justifyContent: 'center',
    },
  },
});
