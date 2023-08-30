import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './AuthContext.css';
import { useNavigate } from 'react-router-dom';

export const AuthContext = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('sign out succesful');
      })
      .catch((error) => console.log(error));
  };
  return (
    <div className='auth-context-container'>
      <div className='auth-info'>
        {currentUser ? (
          <>
            <p>{`Signed in as ${currentUser.email}`}</p>
            <button className='auth-button' onClick={userSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <p>Signed Out</p>
        )}
      </div>
      <button className='home-button' onClick={() => navigate('/')}>
        Home
      </button>
      <button
        className='dashboard-button'
        onClick={() => navigate('/dashboard')}
      >
        Dashboard
      </button>
    </div>
  );
};

export default AuthContext;
