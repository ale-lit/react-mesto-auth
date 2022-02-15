import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';

function Header({email}) {

  console.log(email);

  const [currEmail, setCurrEmail] = useState('');

  const history = useHistory();

  function signOut(){    
    setCurrEmail('');
    localStorage.removeItem('token');
    history.push('/sign-in');
  }

  useEffect(() => {
    setCurrEmail(email);
  }, [email]);

  return (
    <header className="header root__container">
      <div className="header__logo"></div>
      <div className="header__auth">
        {currEmail ? currEmail : ""}
        {currEmail ? (
          <Link onClick={signOut} className="header__link header__link_opacity" to="#">
            Выйти
          </Link>
        ) : (
          <Link className="header__link" to="/sign-up">
            Регистрация
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;