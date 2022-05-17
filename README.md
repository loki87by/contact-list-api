# async-race-api

Api для [Contacts List](https://github.com/loki87by/contact-list).

## Установка и запуск

- Используйте `node 12.x` или выше.
- Откройте командную строку (`PowerShell`, `Git Bash`, и.т.п.)
- Клонируйте данный репозиторий: `$ git clone https://github.com/loki87by/contact-list-api.git`.
- Перейдите в загруженную папку: `$ cd contact-list-api`.
- Установите зависимости: `$ npm install`.
- Запуск сервера: `$ npm start` или `$ node index.js`.
- Можете отправлять запросы в ручном режиме на адрес: `http://localhost:3000`, или пользоваться приложением [Contacts List](https://github.com/loki87by/contact-list).

## Запросы

- **Авторизация**
  - [Регистрация](https://github.com/loki87by/contact-list-api#registration)
  - [Вход в аккаунт](https://github.com/loki87by/contact-list-api#login)
- **Действия с аккаунтом**
  - [Получить список зарегистрированных пользователей](https://github.com/loki87by/contact-list-api#get-users)
  - [Обновить данные пользователя](https://github.com/loki87by/contact-list-api#update-users)
  - [Удалить аккаунт](https://github.com/loki87by/contact-list-api#delete-user)
- **Действия с контактами**
  - [Получить контакты пользователя](https://github.com/loki87by/contact-list-api#get-contacts)
  - [Добавить контакт](https://github.com/loki87by/contact-list-api#add-contacts)
  - [Редактировать контакт](https://github.com/loki87by/contact-list-api#update-contacts)
  - [Удалить контакт](https://github.com/loki87by/contact-list-api#delete-contact)
- **Действия с чужими аккаунтами**
  - [Добавить в контакты другого пользователя](https://github.com/loki87by/contact-list-api#add-friend)
  - [Удалить контакт другого пользователя](https://github.com/loki87by/contact-list-api#delete-friend)
  - [Получить собственные данные](https://github.com/loki87by/contact-list-api#me)

## **Registration**

Регистрирует нового пользователя.

<details>

- **URL**

  /registration

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`

- **URL Params**

  None

- **Query Params**

  **Required:**
  `_name=[string]`

  `_email=[string]`

  `_password=[string]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 201 <br />
    **Content:**
    ```json
    {
      "message": "Регистрация прошла успешно."
    }
    ```

- **Error Response:**

  - **Code:** 409 <br />
    **Content:**
    ```json
    {
      "message": "Пользователь с таким email уже существует."
    }
    ```

  ИЛИ

  - **Code:** 400 <br />
    **Content:**
    ```json
    {
      "message": "Введены не все или некорректные данные."
    }

- **Notes:**

  Можно пройти регистрацию и зайти под новым аккаунтом, либо использовать дефольную [БД](https://github.com/loki87by/contacts-list-api/users)

</details>

## **Login**

Возвращает json web token.

<details>

- **URL**

  /login

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`

- **URL Params**

  None

- **Query Params**

  **Required:**
  `_email=[string]`

  `_password=[string]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjUxMDEwNjM3LCJleHAiOjE2NTE2MTU0Mzd9.BRkyuTIDYNY7pGFAmh7-6AqF81dNmYW8WNaKEru472s"
    }
    ```

- **Error Response:**

  - **Code:** 404 <br />
    **Content:**
    ```json
    {
      "message": "Такой пользователь не зарегистрирован."
    }
    ```

  ИЛИ

  - **Code:** 401 <br />
    **Content:**
    ```json
    {
      "message": "Неправильные почта или пароль."
    }
    ```

  ИЛИ

  - **Code:** 400 <br />
    **Content:**
    ```json
    {
      "message": "Введены не все или некорректные данные."
    }
    ```

- **Notes:**

  None

</details>

## **Get users**

Возвращает массив пользователей.

<details>

- **URL**

  /users

- **Method:**

  `GET`

- **Headers:**

  None

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    [
      {
        "name": "Колобок",
        "email": "Kolobok@gmail.com",
        "avatar": "https://proza.ru/pics/2014/05/10/1565.jpg",
        "friends": []
    },
    {
        "name": "Медведь",
        "email": "Bear@gmail.com",
        "avatar": "https://sportishka.com/uploads/posts/2021-11/1638301090_3-sportishka-com-p-medved-kachok-krasivie-foto-silovie-vidi-s-3.jpg",
        "friends": []
    },
    {
        "name": "Лисица",
        "email": "Fox@gmail.com",
        "avatar": "https://cs14.pikabu.ru/post_img/2022/01/12/10/1642007349154723555.jpg",
        "friends": []
    },
    {
        "name": "Loki87by",
        "email": "loki87.666@gmail.com",
        "avatar": "https://avatars.githubusercontent.com/u/61252310?v=4",
        "phones": [
            "+79955935756"
        ],
        "friends": []
    }
    ]
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Update users**

Редактирует данные аккаунта.

<details>

- **URL**

  /users

- **Method:**

  `PATCH`

- **Headers:**

  `'Content-Type': 'application/json'`
  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  **Optional:**
  `_name=[string]`

  `_email=[string]`

  `_password=[array<oldPassword: string, newPassword: string>]`

  `_avatar=[string]`

  `_phones=[aray<string>]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "message": "Данные успешно обновлены."
    }
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Delete user**

Удаляет аккаунт

<details>

- **URL**

  /users

- **Method:**

  `DELETE`

- **Headers:**

  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 OK <br />
    **Content:**
    ```json
    {
      "message": "Ваш аккаунт удалён."
    }
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Get contacts**

Выдает список контактов.

<details>

- **URL**

  /contacts

- **Method:**

  `GET`

- **Headers:**

  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 4,
      "ownerId": 3,
      "name": "name",
      "phones": ["+435342534"],
      "email": "email@email.email",
      "quote": "hello, world"
    }
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Add contacts**

Добавляет новый контакт.

<details>

- **URL**

  /contacts

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`
  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  **Optional:**
  `_name=[string]`

  `_email=[string]`

  `_avatar=[string]`

  `_phones=[array<string>]`

  `_quote=['string']`

  `_id=['string']`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "message": "Контакт добавлен."
    }
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Update contacts**

Заменяет данные контакта.

<details>

- **URL**

  /contacts

- **Method:**

  `PATCH`

- **Headers:**

  `'Content-Type': 'application/json'`
  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  **Required:**
  `_id=[string|integer]`

  **Optional:**
  `_name=[string]`

  `_email=[string]`

  `_avatar=[string]`

  `_phones=[aray<string>]`

  `_quote=['string']`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "message": "Данные контакта обновлены успешно."
    }
    ```

- **Error Response:**

    **Content:**
    ```json
    {
      "message": "У вас нет прав для совершения данной операции."
    }
    ```

    ИЛИ
    
    ```json
    {
      "message": "Запрос не корректен, данный контакт отсутствует."
    }
    ```

- **Notes:**

  None

</details>

## **Delete contact**

Выдает список контактов.

<details>

- **URL**

  /contacts

- **Method:**

  `GET`

- **Headers:**

  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "id": 4,
      "ownerId": 3,
      "name": "name",
      "phones": ["+435342534"],
      "email": "email@email.email",
      "quote": "hello, world"
    }
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **Add friend**

Добавляет данные зарегистрированного пользователя в список контактов.

<details>

- **URL**

  /friends

- **Method:**

  `POST`

- **Headers:**

  `'Content-Type': 'application/json'`
  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  **Required:**

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "message": "Пользователь добавлен в список ваших контактов."
    }
    ```

- **Error Response:**

    - **Code:** 400 <br />
    **Content:**
    ```json
    {
      "message": "Такой пользователь не зарегистрирован."
    }
    ```

- **Notes:**

  None

</details>

## **delete-friend**

Удаляет контакт из контакт-листа.

<details>

- **URL**

  /friends

- **Method:**

  `DELETE`

- **Headers:**

  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  **Required:**
  `_email=[string]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
    {
      "message": "Пользователь удален из друзей."
    }
    ```

- **Error Response:**

    **Content:**
    ```json
    {
      "message": "Такой пользователь не зарегистрирован."
    }
    ```

- **Notes:**

  None

</details>

## **me**

Возвращает данные конкретного пользователя.

<details>

- **URL**

  /me

- **Method:**

  `GET`

- **Headers:**

  `'Authorization': 'Bearer token'`
  `token` полученный после запроса на [Вход в аккаунт](https://github.com/loki87by/contacts-list-api#login)

- **URL Params**

  None

- **Query Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
    **Content:**
    ```json
      {
        "name": "Колобок",
        "email": "Kolobok@gmail.com",
        "avatar": "https://proza.ru/pics/2014/05/10/1565.jpg",
        "friends": []
    },
    ```

- **Error Response:**

  None

- **Notes:**

  None

</details>

## **БД**

- **Колобок**
  _email:_ Kolobok@gmail.com
  _password:_ "Kolobok123"

- **Медведь**
  _email:_ Bear@gmail.com
  _password:_ Bear123

- **Лисица**
  _email:_ Fox@gmail.com
  _password:_ Fox123

- **Loki87by**
  _email:_ loki87.666@gmail.com
  _password:_ 123123123
