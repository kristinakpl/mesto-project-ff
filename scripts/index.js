// xtodo: Темплейт карточки

// xtodo: DOM узлы

// xtodo: Функция создания карточки

// xtodo: Функция удаления карточки

// xtodo: Вывести карточки на страницу

const placesList = document.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template").content;

function handleCardDelete(cardElement) {
  cardElement.remove();
}

function createCard(item, deleteCallback) {
  const cardElement = cardTemplate.cloneNode(true).querySelector(".card");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = item.link.trim();
  cardImage.alt = item.name;
  cardTitle.textContent = item.name;

  deleteButton.addEventListener("click", function () {
    deleteCallback(cardElement);
  });

  return cardElement;
}

initialCards.forEach(function (item) {
  const cardElement = createCard(item, handleCardDelete);
  placesList.append(cardElement);
});