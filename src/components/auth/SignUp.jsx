import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch((error) => {
        console.log(error);

        if (error.code === 'auth/email-already-in-use') {
          setErrorMessage(
            'This email is already in use. Please use a different email.'
          );
        } else if (error.code === 'auth/email-already-exists') {
          setErrorMessage(
            'The provided email is already in use by an existing user. Each user must have a unique email.'
          );
        } else if (error.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters');
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };

  const handleShowPassword = () => {
    var x = document.getElementById('password-field1');

    if (x.type === 'password') {
      x.type = 'text';
    } else {
      x.type = 'password';
    }
  };

  useEffect(() => {
    var doc = document.getElementById('password-field1');
    var warning = document.getElementById('caps-warning');

    const testCapsLock = (event) => {
      if (event.code === 'CapsLock') {
        let isCapsLockOn = event.getModifierState('CapsLock');
        if (isCapsLockOn) {
          warning.style.display = 'block';
        } else {
          warning.style.display = 'none';
        }
      }
    };

    doc.addEventListener('keyup', testCapsLock);
    doc.addEventListener('keydown', testCapsLock);
  });

  return (
    <div className='sign-up-container'>
      <div className='sign-up-form'>
        <h2>Create Your Account</h2>
        <form onSubmit={handleSignUp}>
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
            id='password-field1'
            onChange={(e) => setPassword(e.target.value)}
          />
          <p id='caps-warning'>Warning: Caps Lock is on!</p>
          <p className='error-message'>{errorMessage}</p>
          <button type='button' onClick={handleShowPassword}>
            Show/Hide Password
          </button>
          <button type='submit'>Sign Up</button>
          <p>Already a user?</p>
          <button type='button' onClick={() => navigate('/sign-in')}>
            Sign in
          </button>
          <button type='button' onClick={() => navigate('/forgot-password')}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
