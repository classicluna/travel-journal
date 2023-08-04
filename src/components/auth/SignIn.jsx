import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);

        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type='submit'>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
