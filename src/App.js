import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Dashboard from './components/Dashboard';
import AuthContext from './components/AuthContext';
import NoPage from './components/NoPage';
import Home from './components/Home';
import Journals from './components/Journals';
import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { useState } from 'react';

function App() {
  const [journalEntries, setJournalEntries] = useState([]);

  const changeJournalEntries = (newEntries) => {
    setJournalEntries(newEntries);
  };

  return (
    <Router basename='/'>
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/sign-in'
            element={
              <>
                <SignIn />
                <SignUp />
                <AuthContext />
              </>
            }
          />
          {/* <Route path='/' element={<SignUp />} /> */}
          {/* Protected route: Redirect to sign-in if not authenticated */}
          <Route
            path='/dashboard'
            element={<Dashboard changeJournalEntries={changeJournalEntries} />}
          />
          <Route path='*' element={<NoPage />} />
          <Route
            path='/journals'
            element={<Journals journalEntries={journalEntries} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
