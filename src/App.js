import React, { Component } from 'react';
import './App.css';
import MovieContainer from './MovieContainer';
import Login from './Login';
import Header from './Header';
import Registration from './Registration';
import { Route, Switch, withRouter } from 'react-router-dom';
import getCookie from 'js-cookie';

const My404 = () => {
  return (
    <div>
      You're lost, will you even be found?
    </div>
    )
}

class App extends Component {
  componentDidMount() {
    this.getToken()
  }
  logOut = async (e) => {
    e.preventDefault();
    const csrfCookie = getCookie('csrftoken');
    const loginResponse = await fetch('http://localhost:8000/auth/logout/', {
      method: 'get',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfCookie,
        'Content-Type': 'application/json',

      },
    });
    console.log(loginResponse, 'this is the log in response line 31')
    const parsedResponse = await loginResponse.json();

    if (parsedResponse.data === "logout successful") {   

      this.props.history.push('/')

    } else {
      console.log(parsedResponse.error)
    }
  }
  getToken = async () => {
    const token = await fetch('http://localhost:8000/auth/getToken', {
      method: 'get',
      credentials: 'include', // this sends our session cookie with our request
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const tokenResponse = token.json();
    return tokenResponse;
}
  render() {
    return (
      <div className="App">
        <Header logOut={this.logOut}/>

        <Switch>
          <Route exact path="/" component={Login}/>
          <Route exact path="/auth" component={Registration}/>
          <Route exact path="/movies" component={MovieContainer} />
          <Route component={My404}/>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
