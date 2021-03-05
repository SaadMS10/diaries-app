import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { User } from '../interfaces/userinterface';
import http from '../services/mirage/api'
import { saveToken, setAuthState } from "../features/auth/authSlice";
import { setUser } from '../features/auth/userSlice';
import { AuthResponse } from '../services/mirage/routes/user';
import { useAppDispatch } from '../stores/index';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://saad10-portfolio.surge.sh/">
       Muhammad Saad
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
 

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

 function Login() {
    const [isLogin, setIsLogin] = useState(true);
const [loading, setLoading] = useState(false);
const dispatch = useAppDispatch();

const submitForm = (data: User) => {
  const path = isLogin ? '/auth/login' : '/auth/signup';
  http
    .post<User, AuthResponse>(path, data)
    .then((res) => {
      if (res) {
        const { user, token } = res;
        dispatch(saveToken(token));
        dispatch(setUser(user));
        dispatch(setAuthState(true));
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false);
    });
};

  const classes = useStyles();
  const { handleSubmit, register } = useForm<User>();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          {isLogin ?  "SIGN IN" : "SIGN UP"}
          </Typography>
          <form className={classes.form}  onSubmit={handleSubmit(submitForm)}>
          <div className="input-container">
          <input ref={register} name="username"      autoFocus/>
		<label>UserName</label>		
	</div>
  <div className="input-container">
<input
              ref={register}
              name="password"
              type="password"
          
            
            />
            <label>Password</label>		
            </div>

         
             {!isLogin && (
                  <div className="input-container">
                 <input
                 ref={register}
                 name="email"
          
               />
               <label>Email</label>		
               </div>
        
             )}
       
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              className={classes.submit}
            >
                {isLogin ? 'SignIn' : 'SignUp'}
            </Button>

              <Grid item>
                <Link href="#"  onClick={() => setIsLogin(!isLogin)} variant="body2" >
            
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account?Sign In'}
                </Link>
              </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
export default Login;