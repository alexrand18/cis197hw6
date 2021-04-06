import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Signup from './Signup.js'
import Home from './Home.js'

const App = () => {
    return (
        <Router>
          <div>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/signup">
                <Signup signingUp = {true} />
              </Route>
              <Route path="/login">
                <Signup signingUp = {false}/>
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      );
}

const Login = () => {
    return <h2>Login</h2>;
}



export default App
  