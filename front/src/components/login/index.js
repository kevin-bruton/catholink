import React from 'react';
import App from '../app';

const Login = (props) => {
  const loggedIn = props.loggedIn;

  return loggedIn.loggedIn ? (<App />) : (
  <div className="columns">
    <div className="column is-one-third"></div>  
    <div className="column is-one-third">
      <section className="hero is-link">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Catholink
            </h1>
          </div>
        </div>
      </section>
      <div className="field">
        <label className="label">Username</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input is-success" type="text" placeholder="Text input"/>
          <span className="icon is-small is-left">
            <i className="fas fa-user"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-check"></i>
          </span>
        </div>
        <p className="help is-success">This username is available</p>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control has-icons-left has-icons-right">
          <input className="input is-danger" type="password" placeholder="Password"/>
          <span className="icon is-small is-left">
            <i className="fas fa-envelope"></i>
          </span>
          <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
        </div>
        <p className="help is-danger">This password is invalid</p>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link">Submit</button>
        </div>
        <div className="control">
          <button className="button is-text">Cancel</button>
        </div>
      </div>
    </div>
    <div className="column is-one-third"></div>
  </div>
  );
};

export default Login;
