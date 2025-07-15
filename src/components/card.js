import { likeCard, unlikeCard } from './api.js';

// === Создание карточки из данных сервера ===
export function createCard(card, handleDelete, handleLike, handleOpenImage, currentUser) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  // Заполняем поля данными с сервера
  cardImage.src = card.link;
  cardImage.alt = card.name;
  cardTitle.textContent = card.name;

  const userId = card.owner._id; // ID владельца карточки из данных сервера
  const isMyCard = currentUser && userId === currentUser._id; // сравниваем с текущим пользователем

  // Если это не наша карточка — прячем кнопку удаления
  if (!isMyCard && deleteButton) {
  deleteButton.remove();
  }

  // Ставим количество лайков
  if (likeCounter) {
    likeCounter.textContent = card.likes.length;
  }

  // Лайк
  likeButton.addEventListener('click', () => {
    handleLike(cardElement, card._id, card.likes.length);
  });

  // Удаление карточки
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      handleDelete(cardElement, card._id);
    });
  }

  // Открытие изображения
  cardImage.addEventListener('click', () => {
    handleOpenImage(card.link, card.name);
  });

  return cardElement;
}

/*//прямое удаление без подтверждения
export function handleCardDelete(cardElement, cardId) {
  deleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => {
      console.error('Не удалось удалить карточку:', err);
    });
}*/

export default function handleCardDelete(cardElement, cardId, openModalFunc, popupConfirmRef, deletionContext) {
  // Сохраняем текущую карточку во внешнем контексте
  deletionContext.currentCard = { cardElement, cardId };

  // Открываем попап подтверждения удаления
  openModalFunc(popupConfirmRef);
}

// Обработчик лайка
export function handleLikeCard(cardElement, cardId, likesCount) {
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (likeButton.classList.contains('card__like-button_is-active')) {
    // Убираем лайк
    unlikeCard(cardId)
      .then(data => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCounter.textContent = data.likes.length;
      })
      .catch(err => {
        console.error('Ошибка при снятии лайка:', err);
      });
  } else {
    // Ставим лайк
    likeCard(cardId)
      .then(data => {
        likeButton.classList.add('card__like-button_is-active');
        likeCounter.textContent = data.likes.length;
      })
      .catch(err => {
        console.error('Ошибка при установке лайка:', err);
      });
  }
}