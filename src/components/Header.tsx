import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/rootReducer';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../stores/index';
import { setAuthState } from "../features/auth/authSlice";

const useStyles = makeStyles((theme) => ({
  root: {
      
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
      textAlign: "center",
    flexGrow: 1,
  },
}));

export default function Header() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const logout=()=>{
    dispatch(setAuthState(false));

  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        
        <Toolbar>
          {isLoggedIn ? 
                 <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <Link to="/"> 
                 <ArrowBackIcon/>
                  {/* ← Go Back */}
                 </Link>
               </IconButton> 
               : null
          
        
        }
 

       
          <Typography variant="h3" className={classes.title}>
            DIARIES APP
          </Typography>
         
          <Button color="inherit" onClick={logout}>Logout</Button>
              
       
         
        </Toolbar>
      </AppBar>
    </div>
  );
}
