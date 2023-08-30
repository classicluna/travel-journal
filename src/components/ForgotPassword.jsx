import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccessMessage(
          'Password reset email sent. Please check your inbox.'
        );
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(
          'Error sending password reset email. Please try again.'
        );
        setSuccessMessage('');
        console.error(error);
      });
  };

  return (
    <div className='forgot-password-container'>
      <div className='forgot-password-form'>
        <h2>Forgot Password</h2>
        <p>Enter your email address to receive a password reset email.</p>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleResetPassword}>Send Reset Email</button>
        {successMessage && <p className='success-message'>{successMessage}</p>}
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <button className='home-button' onClick={() => navigate('/')}>
          Home
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
