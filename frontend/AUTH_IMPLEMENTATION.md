# 🔐 Реализация Аутентификации на Frontend

## ✅ Что реализовано

Полная система аутентификации на фронтенде, интегрированная с Backend API.

---

## 📁 Структура файлов

```
frontend/
├── lib/
│   ├── types/
│   │   └── auth.ts              # TypeScript типы для аутентификации
│   └── api/
│       └── auth.ts              # API сервис для работы с Backend
├── contexts/
│   └── AuthContext.tsx          # React Context для управления состоянием
├── app/
│   ├── layout.tsx               # Root layout с AuthProvider
│   ├── page.tsx                 # Landing page с навигацией
│   ├── login/
│   │   └── page.tsx             # Страница входа
│   ├── register/
│   │   └── page.tsx             # Страница регистрации
│   └── dashboard/
│       └── page.tsx             # Личный кабинет (защищенная страница)
```

---

## 🔧 Компоненты системы

### 1. TypeScript типы (`lib/types/auth.ts`)

Определяет все типы данных для аутентификации:

- `User` - информация о пользователе
- `AuthToken` - токен и данные после логина/регистрации
- `LoginCredentials` - данные для входа
- `RegisterData` - данные для регистрации
- `AuthContextType` - тип контекста аутентификации

```typescript
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  subscription_tier: SubscriptionTier;
  subscription_end_date: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}
```

### 2. API Сервис (`lib/api/auth.ts`)

Класс `AuthAPI` для работы с Backend:

**Методы:**
- `register(data)` - регистрация нового пользователя
- `login(credentials)` - вход пользователя
- `getCurrentUser(token)` - получение информации о текущем пользователе

**Особенности:**
- Автоматическая установка заголовков
- Обработка ошибок
- Интеграция с `NEXT_PUBLIC_API_URL`

```typescript
const response = await authAPI.register({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'Иван Иванов'
});
```

### 3. Auth Context (`contexts/AuthContext.tsx`)

React Context для глобального управления состоянием аутентификации.

**Состояние:**
- `user` - текущий пользователь или null
- `isLoading` - идет ли загрузка
- `isAuthenticated` - авторизован ли пользователь

**Методы:**
- `login(credentials)` - войти в систему
- `register(data)` - зарегистрироваться
- `logout()` - выйти из системы
- `refreshUser()` - обновить данные пользователя

**Использование:**

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Привет, {user?.email}</div>;
  }

  return <button onClick={() => login({...})}>Войти</button>;
}
```

### 4. Страница регистрации (`app/register/page.tsx`)

**Функции:**
- Форма регистрации с валидацией
- Проверка совпадения паролей
- Минимум 8 символов для пароля
- Автоматический редирект на `/dashboard` после успешной регистрации
- Красивый дизайн с cosmic темой

**Поля:**
- Email (обязательно)
- Полное имя (необязательно)
- Пароль (обязательно, минимум 8 символов)
- Подтверждение пароля

### 5. Страница входа (`app/login/page.tsx`)

**Функции:**
- Простая форма входа
- Email + пароль
- Обработка ошибок
- Редирект на `/dashboard` после успешного входа
- Ссылка на регистрацию
- Ссылка на главную страницу

### 6. Dashboard (`app/dashboard/page.tsx`)

**Функции:**
- Защищенная страница (только для авторизованных)
- Автоматический редирект на `/login` если не авторизован
- Информация о пользователе
- Информация о подписке
- Быстрые действия (карточки)
- Кнопка выхода

**Блоки:**
- Приветствие с именем пользователя
- Информация о тарифе
- Быстрые действия (натальная карта, гороскоп, транзиты, совместимость)
- Детальная информация об аккаунте

### 7. Landing Page с навигацией (`app/page.tsx`)

**Обновления:**
- Добавлен header с навигацией
- Кнопки "Вход" и "Регистрация" для неавторизованных
- Email и кнопки "Личный кабинет"/"Выйти" для авторизованных
- Динамические CTA кнопки (меняются в зависимости от статуса аутентификации)

---

## 🔒 Безопасность

### Хранение токена

Токен сохраняется в `localStorage` под ключом `astrology_token`:

```typescript
const TOKEN_KEY = 'astrology_token';
localStorage.setItem(TOKEN_KEY, response.access_token);
```

### Проверка авторизации

При загрузке приложения `AuthContext` автоматически:

1. Проверяет наличие токена в `localStorage`
2. Если токен есть, запрашивает данные пользователя через `/api/v1/auth/me`
3. Если запрос успешен - устанавливает `user`
4. Если запрос неудачен - удаляет токен и устанавливает `user = null`

### Защита маршрутов

Пример защиты страницы:

```tsx
export default function ProtectedPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!user) {
    return null;
  }

  return <div>Защищенный контент</div>;
}
```

---

## 🚀 Использование

### Регистрация нового пользователя

1. Перейти на `/register`
2. Заполнить форму (email, пароль, имя)
3. Нажать "Зарегистрироваться"
4. Автоматический редирект на `/dashboard`

### Вход существующего пользователя

1. Перейти на `/login`
2. Ввести email и пароль
3. Нажать "Войти"
4. Редирект на `/dashboard`

### Выход из системы

1. Нажать кнопку "Выйти" в header или на dashboard
2. Токен удаляется из `localStorage`
3. `user` устанавливается в `null`
4. Редирект на главную страницу

---

## 🌐 API Endpoints используемые

### POST `/api/v1/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "Иван Иванов"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Иван Иванов",
    "subscription_tier": "free",
    "is_active": true,
    "is_verified": false,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

### POST `/api/v1/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Аналогично `/register`

### GET `/api/v1/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Иван Иванов",
  "subscription_tier": "free",
  "subscription_end_date": null,
  "is_active": true,
  "is_verified": false,
  "created_at": "2024-01-01T00:00:00"
}
```

---

## 🎨 Дизайн

Все страницы аутентификации используют:

- Cosmic градиент фон
- Star field анимация
- Backdrop blur эффекты
- Purple/Pink цветовая схема
- Responsive дизайн

Пример классов:

```tsx
<div className="cosmic-bg star-field">
  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
    {/* Контент */}
  </div>
</div>
```

---

## 🧪 Тестирование

### Локальное тестирование

1. Запустите backend:
```bash
docker-compose up -d backend postgres
```

2. Запустите frontend:
```bash
cd frontend
npm run dev
```

3. Откройте http://localhost:3001

4. Тестируйте:
   - Регистрация: `/register`
   - Вход: `/login`
   - Dashboard: `/dashboard`

### Проверка интеграции

1. Зарегистрируйте нового пользователя
2. Проверьте, что токен сохранился в `localStorage`
3. Обновите страницу - должны остаться залогиненными
4. Проверьте dashboard - должна отображаться информация о пользователе
5. Выйдите - должен произойти редирект на главную

---

## 🔍 Отладка

### Проверка токена

```javascript
// В консоли браузера
localStorage.getItem('astrology_token')
```

### Проверка состояния

В React DevTools найдите `AuthContext.Provider` и посмотрите `value`:

- `user` - должен содержать объект пользователя или `null`
- `isLoading` - должен быть `false` после загрузки
- `isAuthenticated` - должен быть `true` если залогинены

### Логи API

Все ошибки API выводятся в консоль:

```typescript
catch (error) {
  console.error('Failed to load user:', error);
}
```

---

## 📝 TODO (Возможные улучшения)

- [ ] Восстановление пароля
- [ ] Email верификация
- [ ] Изменение пароля
- [ ] Редактирование профиля
- [ ] Refresh токены
- [ ] Remember me функция
- [ ] Двухфакторная аутентификация
- [ ] Social auth (Google, Facebook)

---

## ✅ Готово!

Система аутентификации полностью реализована и готова к использованию! 🎉

Все компоненты интегрированы с Backend API и протестированы.
```
