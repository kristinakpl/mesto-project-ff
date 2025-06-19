// Открытие попапа
export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeModalByEscape);
}

// Закрытие попапа
export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeModalByEscape);
}

// Закрытие по Esc
function closeModalByEscape(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

// Закрытие по клику на оверлей
export function handleOverlayClick(evt) {
  if (evt.target.classList.contains('popup')) {
    closeModal(evt.target);
  }
}

// Закрытие по крестику
export function handleCloseButtonClick(button, popup) {
  button.addEventListener('click', () => {
    closeModal(popup);
  });
}