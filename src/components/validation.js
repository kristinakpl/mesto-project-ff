// validation.js

const nameRegex = /^[а-яА-ЯёЁa-zA-Z\- ]{2,40}$/; // для profile-name
const aboutRegex = /^[а-яА-ЯёЁa-zA-Z\- ]{2,200}$/; // для description
const linkRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/; // для card-link

function validateInput(inputElement, config) {
  const errorMessageElement = document.querySelector(`.${inputElement.id}-error`);

  // Всегда проверяем значение, даже если оно "валидно" с точки зрения браузера
  if (inputElement.value.length === 0) {
    errorMessageElement.textContent = inputElement.dataset.errorMessage || 'Вы пропустили это поле.';
    inputElement.setCustomValidity('Вы пропустили это поле.');
  } else if (inputElement.id === 'card-name') {
    // Проверка длины только для поля "Название"
    if (inputElement.value.length < 2) {
      const currentLength = inputElement.value.length;
      errorMessageElement.textContent = `Минимальное количество символов: 2. Длина текста сейчас: ${currentLength} символ${currentLength !== 1 ? 'а' : ''}.`;
      inputElement.setCustomValidity('Минимальное количество символов: 2.');
    } else if (inputElement.value.length > 30) {
      errorMessageElement.textContent = 'Длина названия должна быть не более 30 символов';
      inputElement.setCustomValidity('Длина названия должна быть не более 30 символов');
    } else if (!nameRegex.test(inputElement.value)) {
      errorMessageElement.textContent = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
      inputElement.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
    } else {
      errorMessageElement.textContent = '';
      inputElement.setCustomValidity('');
    }
  } else if (inputElement.id === 'card-link') {
    if (!linkRegex.test(inputElement.value)) {
      errorMessageElement.textContent = 'Введите адрес сайта';
      inputElement.setCustomValidity('Введите корректный URL');
    } else {
      errorMessageElement.textContent = '';
      inputElement.setCustomValidity('');
    }
  } else if (inputElement.id === 'profile-name' && !nameRegex.test(inputElement.value)) {
    errorMessageElement.textContent = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
    inputElement.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
  } else if (inputElement.id === 'description' && !aboutRegex.test(inputElement.value)) {
    errorMessageElement.textContent = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
    inputElement.setCustomValidity('Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
  } else if (inputElement.id === 'profile-name' && inputElement.value.length > 40) {
    errorMessageElement.textContent = 'Длина имени должна быть не более 40 символов';
    inputElement.setCustomValidity('Длина имени должна быть не более 40 символов');
  } else if (inputElement.id === 'description' && inputElement.value.length > 200) {
    errorMessageElement.textContent = 'Длина описания должна быть не более 200 символов';
    inputElement.setCustomValidity('Длина имени должна быть не более 40 символов');
  } else {
    errorMessageElement.textContent = '';
    inputElement.setCustomValidity('');
  }

  // Обновляем стили ошибок
  if (errorMessageElement.textContent) {
    inputElement.classList.add(config.inputErrorClass);
    errorMessageElement.classList.add(config.errorClass);
  } else {
    inputElement.classList.remove(config.inputErrorClass);
    errorMessageElement.classList.remove(config.errorClass);
  }
}

function toggleButtonValidity(formElement, buttonSelector, inactiveButtonClass) {
  const buttonElement = formElement.querySelector(buttonSelector);
  const inputs = Array.from(formElement.querySelectorAll('.popup__input'));
  const isFormValid = inputs.every((input) => input.checkValidity());

  if (isFormValid) {
    buttonElement.classList.remove(inactiveButtonClass);
    buttonElement.disabled = false;
  } else {
    buttonElement.classList.add(inactiveButtonClass);
    buttonElement.disabled = true;
  }
}

export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);

  forms.forEach((formElement) => {
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));

    inputs.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        validateInput(inputElement, config);
        toggleButtonValidity(formElement, config.submitButtonSelector, config.inactiveButtonClass);
      });
    });

    toggleButtonValidity(formElement, config.submitButtonSelector, config.inactiveButtonClass);
  });
}

export function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach((inputElement) => {
    const errorMessageElement = document.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(config.inputErrorClass);
    errorMessageElement.classList.remove(config.errorClass);
    errorMessageElement.textContent = '';
  });

  buttonElement.classList.add(config.inactiveButtonClass);
  buttonElement.disabled = true;
}