import './pages/index.css'; // добавьте импорт главного файла стилей 
import { initialCards } from './components/cards.js';
import { createCard, handleCardDelete, handleLikeCard } from './components/card.js';
import { openModal, closeModal, handleOverlayClick, handleCloseButtonClick } from './components/modal.js';

// Получаем элементы страницы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');

const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formAddCard = document.querySelector('.popup__form[name="new-place"]');

const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');

const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

const popupImageElement = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

// Плавное открытие изображения
function handleOpenImage(src, alt) {
  popupImageElement.src = src;
  popupImageElement.alt = alt;
  popupCaption.textContent = alt;
  openModal(popupImage);
}

// Установка обработчиков событий для модальных окон
document.querySelectorAll('.popup').forEach(popup => {
  // Закрытие по оверлею
  popup.addEventListener('click', handleOverlayClick);
  
// Закрытие по крестику (находим кнопку внутри)
  const closeBtn = popup.querySelector('.popup__close');
  if (closeBtn) {
    handleCloseButtonClick(closeBtn, popup);
  }
});

// Редактирование профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = descriptionInput.value;
  closeModal(popupEdit);
}

function openEditPopup() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(popupEdit);
}

editButton.addEventListener('click', openEditPopup);
formEditProfile.addEventListener('submit', handleEditFormSubmit);

// Добавление новой карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const cardElement = createCard(newCard, handleCardDelete, handleLikeCard, handleOpenImage);
  placesList.prepend(cardElement);
  closeModal(popupAdd);
  formAddCard.reset();
}

addButton.addEventListener('click', () => {
  formAddCard.reset();
  openModal(popupAdd);
});

formAddCard.addEventListener('submit', handleAddFormSubmit);

// Отрисовка начальных карточек
initialCards.forEach(function (item) {
  const cardElement = createCard(item, handleCardDelete, handleLikeCard, handleOpenImage);
  placesList.append(cardElement);
});