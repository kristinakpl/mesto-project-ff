import './pages/index.css'; // добавьте импорт главного файла стилей 
/*import { initialCards } from './components/cards.js';*/
import { createCard, handleLikeCard } from './components/card.js';
import handleCardDelete from './components/card.js';
import { openModal, closeModal, handleOverlayClick, handleCloseButtonClick } from './components/modal.js';
import { enableValidation, clearValidation, validateImageURL} from './components/validation.js';
import {
  fetchUserInfo,
  getInitialCards,
  updateUserInfo,
  addCard,
  deleteCard,
  likeCard,
  unlikeCard,
  updateAvatar
} from './components/api.js';

let currentUser = {};
let currentCardForDeletion = null; // хранит текущую карточку, которую удаляют
let deletionContext = {
  currentCard: null // здесь будет храниться текущая карточка для удаления
};

// Получаем элементы страницы
const placesList = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');

const editButton = document.querySelector('.profile__edit-button');
const addButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__edit-avatar-button');

const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const formUpdateAvatar = document.querySelector('.popup__form[name="update-avatar"]');

const nameInput = document.querySelector('.popup__input_type_name');
const descriptionInput = document.querySelector('.popup__input_type_description');
const cardNameInput = document.querySelector('.popup__input_type_card-name');
const cardLinkInput = document.querySelector('.popup__input_type_url');
const avatarInput = document.querySelector('.popup__input_type_avatar');

const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_update-avatar');
const popupImage = document.querySelector('.popup_type_image');
const popupConfirm = document.querySelector('.popup_type_confirm-delete'); // Попап подтверждения удаления

const popupImageElement = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

// === Получаем данные пользователя и сохраняем в currentUser ===
fetchUserInfo()
  .then(userData => {
    currentUser = userData;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
  })
  .catch(err => {
    console.error('Не удалось загрузить данные пользователя:', err);
  });

  // === Закрытие попапа подтверждения удаления ===
if (popupConfirm) {
  popupConfirm.addEventListener('click', handleOverlayClick);

  const closeBtn = popupConfirm.querySelector('.popup__close');
  if (closeBtn) {
    handleCloseButtonClick(closeBtn, popupConfirm);
  }
}

// === Обработчик формы подтверждения удаления ===
if (popupConfirm) {
  const formConfirm = popupConfirm.querySelector('.popup__form[name="confirm-delete"]');
  if (formConfirm) {
    formConfirm.addEventListener('submit', function (evt) {
      evt.preventDefault();

      if (deletionContext.currentCard) {
        const { cardElement, cardId } = deletionContext.currentCard;

        deleteCard(cardId)
          .then(() => {
            cardElement.remove();
          })
          .catch(err => {
            console.error('Не удалось удалить карточку:', err);
          })
          .finally(() => {
            closeModal(popupConfirm);
            deletionContext.currentCard = null;
          });
      }
    });
  }
}

// Настройки валидации форм
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

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

  const submitButton = formEditProfile.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  // Меняем текст кнопки и делаем её неактивной
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  const userData = {
    name: nameInput.value,
    about: descriptionInput.value
  };

  updateUserInfo(userData)
    .then(userInfo => {
      profileTitle.textContent = userInfo.name;
      profileDescription.textContent = userInfo.about;
      closeModal(popupEdit);
    })
    .catch(err => {
      console.error('Не удалось обновить профиль:', err);
    })
    .finally(() => {
      // Восстанавливаем текст и состояние кнопки
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

function openEditPopup() {
  nameInput.value = profileTitle.textContent;
  descriptionInput.value = profileDescription.textContent;
  openModal(popupEdit);
}

editButton.addEventListener('click', () => {
  openEditPopup();
  clearValidation(formEditProfile, validationConfig); // Очистка ошибок при открытии
});

// нужна для обработки отправки формы
formEditProfile.addEventListener('submit', handleEditFormSubmit);

// Добавление новой карточки
function handleAddFormSubmit(evt) {
  evt.preventDefault();

  // Проверяем, корректна ли ссылка
  if (!validateImageURL(cardLinkInput.value)) {
    cardLinkInput.setCustomValidity('Введите прямую ссылку на изображение (.jpg, .png, .webp)');
    cardLinkInput.reportValidity();
    return;
  }

  const submitButton = formAddCard.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  // Меняем текст кнопки и делаем её неактивной
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  const cardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };

  addCard(cardData)
    .then(newCard => {
      const cardElement = createCard(
        newCard,
        () => handleCardDelete(cardElement, newCard._id),
        () => handleLikeCard(cardElement, newCard._id, newCard.likes.length),
        handleOpenImage
      );
      placesList.prepend(cardElement);
      closeModal(popupAdd);
      formAddCard.reset();
      clearValidation(formAddCard, validationConfig);
    })
    .catch(err => {
      console.error('Не удалось добавить карточку:', err);
      })
    .finally(() => {
      // Восстанавливаем кнопку
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButton = formUpdateAvatar.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  // Проверяем, корректна ли ссылка
  if (!validateImageURL(avatarInput.value)) {
    avatarInput.setCustomValidity('Введите прямую ссылку на изображение (.jpg, .png, .webp)');
    avatarInput.reportValidity();
    return;
  }

  // Меняем текст кнопки и делаем её неактивной
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  const avatarUrl = avatarInput.value;

  updateAvatar(avatarUrl)
    .then(userInfo => {
      profileImage.style.backgroundImage = `url(${userInfo.avatar})`;
      closeModal(popupAvatar);
      formUpdateAvatar.reset();
      clearValidation(formUpdateAvatar, validationConfig);
    })
    .catch(err => {
      console.error('Не удалось обновить аватар:', err);
      })
    .finally(() => {
      // Восстанавливаем кнопку
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
}

avatarEditButton.addEventListener('click', () => {
  formUpdateAvatar.reset();
  clearValidation(formUpdateAvatar, validationConfig);
  openModal(popupAvatar);
});

formUpdateAvatar.addEventListener('submit', handleAvatarFormSubmit);

addButton.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openModal(popupAdd);
});

formAddCard.addEventListener('submit', handleAddFormSubmit);

/* // Отрисовка начальных карточек
initialCards.forEach(function (item) {
  const cardElement = createCard(item, handleCardDelete, handleLikeCard, handleOpenImage);
  placesList.append(cardElement);
});*/

// === Загрузка данных при старте ===
Promise.all([fetchUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    // Заполняем профиль
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    // Отрисовываем карточки
    cards.forEach(card => {
  const cardElement = createCard(
    card,
    () => handleCardDelete(cardElement, card._id, openModal, popupConfirm, deletionContext),
    () => handleLikeCard(cardElement, card._id, card.likes.length),
    handleOpenImage,
    currentUser
  );
  placesList.append(cardElement);
});
  })
  .catch(err => {
    console.error('Не удалось загрузить начальные данные:', err);
    alert('Не удалось загрузить данные. Попробуйте позже.');
  });

  // Включаем валидацию
  enableValidation(validationConfig);