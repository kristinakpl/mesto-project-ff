// Функция создания карточки
export function createCard(item, handleDelete, handleLike, handleOpenImage) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = item.link.trim();
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  deleteButton.addEventListener('click', () => {
    handleDelete(cardElement);
  });

  likeButton.addEventListener('click', () => {
    handleLike(likeButton);
  });

  cardImage.addEventListener('click', () => {
    handleOpenImage(cardImage.src, cardImage.alt);
  });

  return cardElement;
}

// Обработчик удаления карточки
export function handleCardDelete(cardElement) {
  cardElement.remove();
}

// Обработчик лайка
export function handleLikeCard(cardLikeButton) {
  cardLikeButton.classList.toggle('card__like-button_is-active');
}