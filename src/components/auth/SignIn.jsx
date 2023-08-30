import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch((error) => {
        console.log(error);

        if (error.code === 'auth/user-not-found') {
          setErrorMessage(
            'User not found. Please check your email and password.'
          );
        } else if (error.code === 'auth/wrong-password') {
          setErrorMessage('Incorrect Password. Please check your password.');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };

  function handleShowPassword() {
    var x = document.getElementById('password-field2');
    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  }

  useEffect(() => {
    var doc = document.getElementById('password-field2');
    var warning = document.getElementById('caps-warning1');
    doc.addEventListener('keyup', testCapsLock);
    doc.addEventListener('keydown', testCapsLock);

    function testCapsLock(event) {
      if (event.code === 'CapsLock') {
        let isCapsLockOn = event.getModifierState('CapsLock');
        if (isCapsLockOn) {
          warning.style.display = 'block';
        } else {
          warning.style.display = 'none';
        }
      }
    }
  });

  return (
    <div className='sign-in-container'>
      <div className='sign-in-form'>
        <h2>Sign In to Your Account</h2>
        <form onSubmit={handleSignIn}>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            id='password-field2'
            onChange={(e) => setPassword(e.target.value)}
          />
          <p id='caps-warning1'>Warning: Caps Lock is on!</p>
          <p className='error-message'>{errorMessage}</p>
          <button type='button' onClick={handleShowPassword}>
            Show/Hide Password
          </button>
          <button type='submit'>Sign In</button>
          <p>Don't have an account yet?</p>
          <button type='button' onClick={() => navigate('/sign-up')}>
            Sign up
          </button>
          <button type='button' onClick={() => navigate('/forgot-password')}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
