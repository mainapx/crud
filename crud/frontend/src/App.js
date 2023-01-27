import React from 'react';
import './App.css';
import {Route,BrowserRouter,Redirect} from 'react-router-dom';
import Login from './container/login/login.js';
import Register from './container/register/register.js';
import Admin from './container/admin/admin.js';
import Verify from './container/verify/verify.js';

function App() {
 return(
  <BrowserRouter>
    <Route exact path="/login" component={Login}/>
    <Route exact path="/register" component={Register}/>
    <Route exact path="/verify" component={Verify}/>
    <Route exact path="/admin" component={Admin}/>
  </BrowserRouter>
  );
}

export default App;
