import React, { FC, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/rootReducer';



import './App.css'
import Loading from './Loading';

// const Auth = lazy(() => import('./Auth'));
const Login= lazy(() => import('./Login'));
const Home = lazy(() => import('./Home'));

const App: FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <Router>
      <Switch>
   
        
        <Route path="/">
        
          <Suspense fallback={<Loading/>} >
            {isLoggedIn ? <Home /> : <Login/>  }
          </Suspense>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;