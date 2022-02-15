import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as auth from '../auth.js';

function Register({onSubmitForm, onClosePopup}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory(); 
  
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function redirectToLogin() {
    onClosePopup();
    history.push('/sign-in');
  }

  function handleSubmit(e) {
    e.preventDefault();
    auth.register(password, email).then((res) => {
      if(res){
        onSubmitForm('success');
        setTimeout(redirectToLogin, 3000);
      } else {
        onSubmitForm('fail');
      };
    })
  }

  return (
    <form onSubmit={handleSubmit} className="auth">  
      <h1 className="auth__title">Регистрация</h1>
      <input type="email" className="auth__input" placeholder="Email" value={email || ''} onChange={handleEmailChange} required />
      <input type="password" className="auth__input" placeholder="Пароль" value={password || ''} onChange={handlePasswordChange} required />
      <button type="submit" className="auth__submit">Зарегистрироваться</button>
      <Link to="/sign-in" className="auth__link">Уже зарегистрированы? Войти</Link>
    </form>
  );
}

export default Register;