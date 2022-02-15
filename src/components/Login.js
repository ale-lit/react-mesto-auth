import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as auth from '../auth.js';

function Login({handleLogin, onError}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password){
      return;
    }
    auth.authorize(email, password)
      .then((data) => {
        if(data.token){
          setEmail('');
          setPassword('');
          handleLogin(data.token);
          history.push('/');
        }  
      })
      .catch(() => { // запускается, если пользователь не найден
        onError('fail');
      });
  }

  return (
    <form onSubmit={handleSubmit} className="auth">  
      <h1 className="auth__title">Вход</h1>
      <input type="email" className="auth__input" placeholder="Email" value={email || ''} onChange={handleEmailChange} required />
      <input type="password" className="auth__input" placeholder="Пароль" value={password || ''} onChange={handlePasswordChange} required />
      <button type="submit" className="auth__submit">Войти</button>
    </form>
  );
}

export default Login;