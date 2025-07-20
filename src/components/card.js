import { likeCard, unlikeCard } from './api.js';
// === Создание карточки из данных сервера ===
export function createCard(
  card,
  handleDelete, // колбэк для удаления
  handleLike,  // колбэк для лайка
  handleOpenImage,
  currentUser
) {
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

  const isMyCard = currentUser && card.owner._id === currentUser._id;

  // Если это не наша карточка — прячем кнопку удаления
  if (!isMyCard && deleteButton) {
    deleteButton.remove();
  }

  // Проверяем, поставил ли текущий пользователь лайк
  const hasUserLiked = card.likes.some(like => like._id === currentUser._id);
  if (hasUserLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Ставим количество лайков
  if (likeCounter) {
    likeCounter.textContent = card.likes.length;
  }

  // Лайк
  likeButton.addEventListener('click', () => {
    handleLike(cardElement, card._id, likeButton, likeCounter);
  });

  // Удаление карточки
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      handleDelete(cardElement, card._id); // вызываем колбэк
    });
  }

  // Открытие изображения
  cardImage.addEventListener('click', () => {
    handleOpenImage(card.link, card.name);
  });

  return cardElement;
}