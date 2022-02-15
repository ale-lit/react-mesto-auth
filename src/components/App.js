import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import {api} from '../utils/api.js';
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltipPopup from "./InfoTooltipPopup";
import * as auth from '../auth.js';

function App() {
  const [currentUser, setCurrentUser] = useState({});

  console.log(currentUser);

  const [currentEmail, setCurrentEmail] = useState('');
  
  const [isRegisterResult, setIsRegisterResult] = useState('');
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] =
  useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    useState(false);    
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});

  const [loggedIn, setLoggedIn] = useState(false);

  const history = useHistory();

  function handleInfoTooltipPopupOpen(result) {    
    setIsRegisterResult(result);
    setIsInfoTooltipPopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(newUser) {
    api.editUserInfo(newUser.name, newUser.about)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(newAvatarUrl) {
    api.changeAvatar(newAvatarUrl.avatar)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [cards, setCards] = useState([]);

  useEffect(() => {
    tokenCheck();
    api.getAllNeededData()
      .then(([cards, user]) => {
        setCurrentUser(user);
        setCards(cards);        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);  

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  } 

  function handleCardDelete(id) {
    api.deleteCard(id)
      .then(() => {
        setCards(cards.filter(card => card._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    api.postCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogOut() {
    setLoggedIn(false);
  }

  function tokenCheck() {
    if (localStorage.getItem('token')){
      const token = localStorage.getItem('token');
      if(token) {
        auth.getContent(token).then((res) => {
          if (res){
            console.log(token);
            console.log(res);

            setCurrentEmail(res.data.email);
            // авторизуем пользователя
            setLoggedIn(true);
            history.push('/');
          }
        }); 
      }
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header email={currentEmail} />

      <div className="popup popup_type_info-tooltip">
        <div className="popup__container">Вы успешно зарегистрировались!</div>
      </div> 
      
      <Switch>
        <Route path="/sign-up">
          <Register onSubmitForm={handleInfoTooltipPopupOpen} onClosePopup={closeAllPopups} />
        </Route>
        <Route path="/sign-in">
          <Login handleLogin={handleLogin} onError={handleInfoTooltipPopupOpen} />
        </Route>
        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Main}
          onCardClick={handleCardClick}
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
      </Switch>

      <Footer />      

      <InfoTooltipPopup isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isResult={isRegisterResult} />

      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
      
      <PopupWithForm onClose={closeAllPopups} name="submit" title="Вы уверены?">
        <input type="submit" value="Да" className="popup__save-button" />
      </PopupWithForm>

      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
    </CurrentUserContext.Provider>
  );
}

export default App;
