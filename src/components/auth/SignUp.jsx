import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);

        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
