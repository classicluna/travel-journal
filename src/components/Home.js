import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleLogIn = () => {
    console.log('going to sign in page');
    navigate('/sign-in');
  };

  const handleHome = () => {
    console.log('going to journal');
    navigate('/dashboard');
  };
  return (
    <div className='bg'>
      <div className='container'>
        <h1 className='header'> Globe Jottings: record your travel stories!</h1>
        <div className='button-container'>
          <button className='button' onClick={handleLogIn}>
            Log in
          </button>
          <button className='button' onClick={handleHome}>
            Go to your journal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
