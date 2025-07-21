
// === Функция проверяет, является ли ссылка прямой ссылкой на изображение ===
/*export function validateImageURL(url) {
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
};*/

// === Функция проверяет, является ли ссылка прямой ссылкой на изображение ===
export function validateImageURL(url) {
  const validExtensions = /\.(jpeg|jpg|png|webp|gif)$/i;
  return validExtensions.test(url);
}

// === Показывает сообщение об ошибке ===
export function showInputError(formElement, inputElement, errorMessage, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.add(validationConfig.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(validationConfig.errorClass);
  }
}

// === Скрывает сообщение об ошибке ===
export function hideInputError(formElement, inputElement, validationConfig) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (errorElement) {
    inputElement.classList.remove(validationConfig.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(validationConfig.errorClass);
  }
}

// === Проверяет валидность поля через input.validity ===
export function checkInputValidity(inputElement, validationConfig) {
  const formElement = inputElement.closest(validationConfig.formSelector);
  const validity = inputElement.validity;

  // Очищаем предыдущее сообщение
  inputElement.setCustomValidity('');

  let errorMessage = inputElement.validationMessage;

  // === valueMissing — поле пустое ===
  if (validity.valueMissing) {
    errorMessage = inputElement.dataset.errorMessage || 'Вы пропустили это поле.';
  }

  // === patternMismatch — не совпадает с pattern ===
  else if (validity.patternMismatch) {
    if (inputElement.dataset.errorMessage) {
      errorMessage = inputElement.dataset.errorMessage;
    } else {
      errorMessage = 'Проверьте формат ввода.';
    }
  }

  // === typeMismatch — URL или email невалиден ===
  else if (validity.typeMismatch) {
    if (inputElement.type === 'url') {
      errorMessage = 'Введите корректный URL.';
    } else if (inputElement.type === 'email') {
      errorMessage = 'Введите корректный email.';
    }
  }

  // === tooShort или tooLong — длина вне диапазона ===
  else if (validity.tooShort || validity.tooLong) {
    if (validity.tooShort) {
      errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Сейчас: ${inputElement.value.length}`;
    } else if (validity.tooLong) {
      errorMessage = `Максимальное количество символов: ${inputElement.maxLength}`;
    }
  }

   else {
    const nameRegex = /^[а-яА-ЯёЁa-zA-Z\- ]{2,30}$/;
    const descriptionRegex = /^[а-яА-ЯёЁa-zA-Z\- ]{2,200}$/;

    if (inputElement.name === 'name' || inputElement.name === 'cardName') {
      if (!nameRegex.test(inputElement.value)) {
        errorMessage = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
        inputElement.setCustomValidity(errorMessage);
        errorMessage = inputElement.validationMessage;
      }
    }

    if (inputElement.name === 'description') {
      if (!descriptionRegex.test(inputElement.value)) {
        errorMessage = 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы';
        inputElement.setCustomValidity(errorMessage);
        errorMessage = inputElement.validationMessage;
      }
    }
  }

  // Устанавливаем кастомное сообщение, если нужно
  inputElement.setCustomValidity(errorMessage);
  inputElement.reportValidity();

  // Обновляем интерфейс
  if (!inputElement.checkValidity()) {
    showInputError(formElement, inputElement, errorMessage, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
}

// === Переключает состояние кнопки формы ===
export function toggleButtonValidity(formElement, validationConfig) {
  const button = formElement.querySelector(validationConfig.submitButtonSelector);
  const inputs = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const isFormValid = inputs.every(input => input.checkValidity());

  if (button) {
    if (isFormValid) {
      button.classList.remove(validationConfig.inactiveButtonClass);
      button.disabled = false;
    } else {
      button.classList.add(validationConfig.inactiveButtonClass);
      button.disabled = true;
    }
  }
}

// === Назначает обработчики событий для формы ===
function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(inputElement, validationConfig);
      toggleButtonValidity(formElement, validationConfig);
    });
  });

  toggleButtonValidity(formElement, validationConfig);
}

// === Включает валидацию для всех форм ===
export function enableValidation(validationConfig) {
  const formList = document.querySelectorAll(validationConfig.formSelector);
  formList.forEach(formElement => {
    setEventListeners(formElement, validationConfig);
  });
}

// === Очищает ошибки валидации ===
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach(inputElement => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(validationConfig.inputErrorClass);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(validationConfig.errorClass);
    }
    inputElement.setCustomValidity('');
  });

  if (submitButton) {
    submitButton.classList.add(validationConfig.inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// === Конфигурация валидации ===
export const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};