import { Link } from 'react-router-dom';

function Header({email, handleLogOut}) {

  return (
    <header className="header root__container">
      <div className="header__logo"></div>
      <div className="header__auth">
        {email ? email : ""}
        {email ? (
          <Link onClick={handleLogOut} className="header__link header__link_opacity" to="#">
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