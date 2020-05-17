import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS,
} from '../types';
import React, { useReducer } from 'react';

const GithubState = (props) => {
  const intialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(GithubReducer, intialState);

  const searchUsers = async (text) => {
    dispatch({ type: SET_LOADING });

    const res = await axios.get('https://api.github.com/search/users', {
      params: {
        q: text,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      },
    });

    dispatch({
      type: SEARCH_USERS,
      payload: res.data,
    });
  };

  const getUser = async (login) => {
    dispatch({ type: SET_LOADING });

    const res = await axios.get(`https://api.github.com/users/${login}`, {
      params: {
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
      },
    });

    dispatch({
      type: GET_USER,
      payload: res.data,
    });
  };

  const getUserRepos = async (login) => {
    dispatch({ type: SET_LOADING });

    const res = await axios.get(`https://api.github.com/users/${login}/repos`, {
      params: {
        per_page: 5,
        sort: 'created:asc',
        client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
        client_secret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
      },
    });

    dispatch({ type: GET_REPOS, payload: res.data });
  };

  const clearUsers = () => {
    dispatch({ type: CLEAR_USERS });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
