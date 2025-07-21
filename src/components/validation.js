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

// === Проверяет валидность поля ввода ===
export function checkInputValidity(inputElement, validationConfig) {
  const formElement = inputElement.closest(validationConfig.formSelector);
  let errorMessage = '';
  const validity = inputElement.validity;

  if (!validity.valid) {
    // Поле пустое
    if (validity.valueMissing) {
      errorMessage = inputElement.dataset.errorMessage || 'Вы пропустили это поле.';
    
    // Слишком мало символов
    } else if (validity.tooShort) {
      errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Сейчас: ${inputElement.value.length}`;
    
    // Нарушение pattern (недопустимые символы)
    } else if (validity.patternMismatch) {
      errorMessage = inputElement.dataset.errorMessage || 'Недопустимый формат ввода.';
    
    // Некорректный URL
    } else if (validity.typeMismatch && inputElement.type === 'url') {
      errorMessage = 'Введите корректный URL.';
    
    // Слишком много символов
    } else if (validity.tooLong) {
      errorMessage = `Максимальное количество символов: ${inputElement.maxLength}`;
    }

    inputElement.setCustomValidity(errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  // Обновляем интерфейс ошибки
  if (!inputElement.checkValidity()) {
    showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
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
export function enableValidation(config) {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach(form => {
    setEventListeners(form, config);
  });
}

// === Очищает ошибки валидации ===
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  inputList.forEach(inputElement => {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, validationConfig);
  });

  const submitButton = formElement.querySelector(validationConfig.submitButtonSelector);
  if (submitButton) {
    submitButton.classList.add(validationConfig.inactiveButtonClass);
    submitButton.disabled = true;
  }
}