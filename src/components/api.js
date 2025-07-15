// === Конфигурация API ===
export const config = {
  baseUrl: 'https://mesto.nomoreparties.co/v1',
  cohortId: 'wff-cohort-41',
  headers: {
    authorization: '90f0197a-2479-4135-bf17-f0596cbee6c6',
    'Content-Type': 'application/json'
  }
};
// === Универсальная функция для всех запросов ===
function request(endpoint, options) {
  const url = `${config.baseUrl}/${config.cohortId}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      ...config.headers,
      ...options.headers // позволяет переопределять заголовки
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      }

      return Promise.reject(new Error(`Ошибка: ${res.status}`));
    })
    .catch(err => {
      console.error('[API] Произошла ошибка:', err.message);
      return Promise.reject(err);
    });
}

// === Запросы к серверу ===

// Получить данные пользователя
export function fetchUserInfo() {
  return request('/users/me', {
    method: 'GET'
  });
}

// Обновить профиль пользователя
export function updateUserInfo(userData) {
  return request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(userData)
  });
}

// Получить список карточек
export function getInitialCards() {
  return request('/cards', {
    method: 'GET'
  });
}

// Добавить новую карточку
export function addCard(cardData) {
  return request('/cards', {
    method: 'POST',
    body: JSON.stringify(cardData)
  });
}

// Удалить карточку
export function deleteCard(cardId) {
  return request(`/cards/${cardId}`, {
    method: 'DELETE'
  });
}

// Поставить лайк
export function likeCard(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: 'PUT'
  });
}

// Убрать лайк
export function unlikeCard(cardId) {
  return request(`/cards/likes/${cardId}`, {
    method: 'DELETE'
  });
}

// Обновить аватар
export function updateAvatar(avatarUrl) {
  return request(`/users/me/avatar`, {
    method: 'PATCH',
    body: JSON.stringify({ avatar: avatarUrl })
  });
}