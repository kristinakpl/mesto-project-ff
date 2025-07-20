
// === Функция проверяет, является ли ссылка прямой ссылкой на изображение ===
export function validateImageURL(url) {
  const validExtensions = /\.(jpeg|jpg|png|webp|gif)$/i;
  return validExtensions.test(url);
}

// === Обновлённая функция валидации полей ===
function validateInput(inputElement, config) {
  const { validators, minLength, maxLength, inputErrorClass, errorClass } = config;
  const errorElement = document.querySelector(`.${inputElement.id}-error`);

  let errorMessage = '';
  const inputValue = inputElement.value.trim();
  const inputName = inputElement.getAttribute('name');

  // === 1. Проверка на пустое поле ===
  if (!inputValue) {
    errorMessage = inputElement.dataset.errorMessage || 'Вы пропустили это поле.';
  }

  // === 2. Проверка минимальной длины ===
  else if (minLength[inputName] && inputValue.length < minLength[inputName]) {
    errorMessage = `Минимальное количество символов: ${minLength[inputName]}. Сейчас: ${inputValue.length}`;
  }

  // === 3. Проверка максимальной длины ===
  else if (maxLength[inputName] && inputValue.length > maxLength[inputName]) {
    errorMessage = `Максимальное количество символов: ${maxLength[inputName]}`;
  }

  // === 4. Проверка по регулярке или кастомной функции ===
  else if (validators[inputName]) {
    const validator = validators[inputName];

    if (validator.regex && !validator.regex.test(inputValue)) {
      errorMessage = validator.error;
    } else if (validator.validator && !validator.validator(inputValue)) {
      errorMessage = validator.error;
    }
  }

  // === 5. Если всё ок, очищаем ошибку ===
  if (!errorMessage) {
    inputElement.setCustomValidity('');
  } else {
    inputElement.setCustomValidity(errorMessage);
  }

  // === Обновляем интерфейс ошибок ===
  errorElement.textContent = errorMessage;
  inputElement.classList.toggle(inputErrorClass, !!errorMessage);
  errorElement.classList.toggle(errorClass, !!errorMessage);
}

// === Включаем валидацию для всех форм ===
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);

  forms.forEach((formElement) => {
    const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
    const submitButton = formElement.querySelector(config.submitButtonSelector);

    function handleInput() {
      inputs.forEach(input => validateInput(input, config));
      toggleButtonValidity(formElement, submitButton, config.inactiveButtonClass);
    }

    inputs.forEach(input => {
      input.addEventListener('input', handleInput);
    });

    toggleButtonValidity(formElement, submitButton, config.inactiveButtonClass);
  });
}

// === Функция переключает состояние кнопки отправки ===
function toggleButtonValidity(formElement, buttonElement, inactiveButtonClass) {
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

// === Функция очищает ошибки валидации ===
export function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const button = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    const errorElement = document.querySelector(`.${input.id}-error`);
    input.classList.remove(config.inputErrorClass);
    errorElement.classList.remove(config.errorClass);
    errorElement.textContent = '';
    input.setCustomValidity('');
  });

  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}

// === Конфигурация для валидации ===
export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  validators: {
    name: {
      regex: /^[а-яА-ЯёЁa-zA-Z\- ]{2,40}$/i,
      error: 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы'
    },
    description: {
      regex: /^[а-яА-ЯёЁa-zA-Z\- ]{2,200}$/i,
      error: 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы'
    },
    url: {
      regex: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/i,
      error: 'Введите корректный URL'
    },
    image: {
      validator: validateImageURL,
      error: 'Введите прямую ссылку на изображение (.jpg, .png, .webp)'
    }
  },
  minLength: {
    name: 2,
    description: 2,
    cardName: 2
  },
  maxLength: {
    name: 40,
    description: 200,
    cardName: 30
  }
};