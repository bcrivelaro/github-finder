import './App.css';
import React, { Component, Fragment } from 'react';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import axios from 'axios';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import About from './components/pages/About';
import User from './components/users/User';

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null
  }

  searchUsers = async text => {
    this.setState({ loading: true });

    const res = await axios.get('https://api.github.com/search/users',
      {
        params: {
          q: text,
          client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
          client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET
        }
      }
    )

    this.setState({ users: res.data.items, loading: false });
  }

  getUser = async login => {
    this.setState({ loading: true });

    const res = await axios.get(`https://api.github.com/users/${login}`,
      {
        params: {
          client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
          client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET
        }
      }
    )

    this.setState({ user: res.data, loading: false });
  }

  clearUsers = () => {
    this.setState({ users: [], loading: false });
  }

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  }

  render() {
    const { users, user, loading } = this.state;

    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => (
                <User {...props} getUser={this.getUser} user={user} loading={loading} />
              )} />
            </Switch>

          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
