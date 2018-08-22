import React, { Component } from 'react';
import styles from './App.scss';
import { Link, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <Link to="/"><h1 className={styles.title}>Catholink</h1></Link>
        </header>
        <div className="columns">
          <div className="column is-narrow">
            <aside className="menu">          
              <ul className="menu-list">
                <li><Link className={window.location.pathname === '/' ? 'is-active' : null} to="/">Home</Link></li>
                <li><Link className={window.location.pathname === '/about' ? 'is-active' : null}to="/about">About</Link></li>
              </ul>
            </aside>
          </div>
          <div className="column">
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
