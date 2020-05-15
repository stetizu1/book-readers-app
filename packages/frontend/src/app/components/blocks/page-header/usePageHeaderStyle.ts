import { makeStyles } from '@material-ui/core/styles';


export const usePageHeaderStyle = makeStyles({
  outside: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    maxWidth: '500px',
    fontWeight: 'bold',
    padding: '10px 16px 0',
    fontSize: '2em',
    flexGrow: 1,
  },
});
