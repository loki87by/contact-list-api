const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const bcrypt = require("bcrypt");
const JWT_SECRET = "JWT_SECRET";

const db = {
  users: [
    {
      name: "Колобок",
      email: "kolobok@gmail.com",
      password: "$2b$10$r3cWgdqgz5mlYnvNXzLs2uMQKAv8mzpmcaq0uxJXIBXTtna3qpCKO",
      avatar: "https://proza.ru/pics/2014/05/10/1565.jpg",
      id: 1,
      friends: [],
    },
    {
      name: "Медведь",
      email: "bear@gmail.com",
      password: "$2b$10$CR3ivFjGHdJ3KrrHnWPfAuP8wKshg2.MJMdHIlAiQ.WuxtEx5tAP.",
      avatar:
        "https://sportishka.com/uploads/posts/2021-11/1638301090_3-sportishka-com-p-medved-kachok-krasivie-foto-silovie-vidi-s-3.jpg",
      id: 2,
      friends: [],
    },
    {
      name: "Лисица",
      email: "fox@gmail.com",
      password: "$2b$10$SS00ad.FnTQGt6dqE5lrpON0K2/R5IKl8DO7KuwBqsvoBv4J4dmDS",
      avatar:
        "https://cs14.pikabu.ru/post_img/2022/01/12/10/1642007349154723555.jpg",
      id: 3,
      friends: [],
    },
    {
      name: "Loki87by",
      email: "loki87.666@gmail.com",
      password: "$2b$10$KixvqQYRlQ7.2l2rLndteuB5DvUzglCcgHdsdSV/dP8uZ4EWoOz2i",
      avatar: "https://avatars.githubusercontent.com/u/61252310?v=4",
      phones: ["+79955935756"],
      id: 4,
      friends: [],
    },
  ],
  contacts: [
    {
      id: '1',
      ownerId: 1,
      name: "Бабушка",
      email: "grandMa@mail.ru",
      avatar:
        "http://s11.pikabu.ru/post_img/big/2020/09/23/7/16008554511492692.jpg",
      phones: ["+79214567890"],
      quote: "Трубку не брать, будет плакаться.",
    },
    {
      id: '2',
      ownerId: 1,
      name: "Дедушка",
      email: "grandFa@mail.ru",
      avatar:
        "https://cdnb.artstation.com/p/assets/images/images/032/967/687/large/eduard-nabiullin-1.jpg?1608016734",
      phones: ["+79954567890"],
      quote: "Трубку не брать, обматерит.",
    },
    {
      id: '3',
      ownerId: 2,
      name: "Заяц",
      email: "rabbit@gmail.com",
      avatar:
        "https://cs5.pikabu.ru/images/big_size_comm/2014-10_3/14133542518215.jpg",
      phones: [],
      quote: "Вечно просит защитить",
    },
    {
      id: '4',
      ownerId: 3,
      name: "Волк",
      email: "wolf@gmail.com",
      avatar: "https://pxlprint.ru/wp-content/uploads/2014/09/stark.png",
      phones: [],
      quote: "Серый глупец",
    },
  ],
};

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
const PORT = 3000;
server.use(middlewares);

server.post("/registration", (req, res) => {
  const { name, email, password } = req.query;

  if (db.users.find((user) => user.email === email)) {
    return res
      .status(409)
      .send({ message: "Пользователь с таким email уже существует." });
  }

  if ((name, email, password)) {
    bcrypt.hash(password, 10).then((hash) => {
      const ids = db.users.map((i) => i.id);
      const idCounter = Math.max(...ids) + 1;
      const newUser = {
        name: name,
        email: email.toLowerCase(),
        password: hash,
        id: idCounter,
        contacts: [],
      };
      db.users.push(newUser);
      res
        .header("Content-Type", "application/json")
        .status(201)
        .send({ message: "Регистрация прошла успешно" });
    });
  } else {
    res.status(400).send({ message: "Введены не все или некорректные данные" });
  }
});

server.get("/users", (req, res) => {
  const visibleUsersData = db.users.map((user) => {
    const { name, email, avatar, phones, friends } = user;
    return { name, email, avatar, phones, friends };
  });
  res.status(200).send(visibleUsersData);
});

server.post("/users", (req, res) => {
  res
    .status(404)
    .send({ message: "Этот номер не пройдёт, регистрируйтесь по правилам" });
});

server.post("/login", (req, res) => {
  const { email, password } = req.query;

  if ((email, password)) {
    const currentUser = db.users.find((user) => user.email === email.toLowerCase());

    if (!currentUser) {
      return res
        .status(404)
        .send({ message: "Такой пользователь не зарегистрирован." });
    }
    bcrypt.compare(password, currentUser.password).then((truePass) => {
      if (truePass) {
        const token = jwt.sign({ id: currentUser.id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
      } else {
        res.status(401).send({ message: "Неправильные почта или пароль" });
      }
    });
  } else {
    res.status(400).send({ message: "Введены не все или некорректные данные" });
  }
});

server.use(auth);

server.patch("/users", (req, res) => {
  const { name, email, password, avatar, phones } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);

  if (name) {
    userData.name = decodeURI(name);
  }

  if (email) {
    userData.email = decodeURI(email);
  }

  if (avatar) {
    userData.avatar = decodeURI(avatar);
  }

  if (phones) {
    const stringifyArray = phones.split("~");
    const phonesArray = stringifyArray.map((phone) => decodeURI(phone));
    userData.phones = phonesArray;
  }

  if (!password) {
    res.status(200).send({ message: "Данные успешно обновлены" });
  }

  if (password) {
    const stringifyArray = password.split("~");
    const passArray = stringifyArray.map((pass) => decodeURI(pass));
    bcrypt.compare(passArray[0], userData.password).then((truePass) => {
      if (truePass) {
        bcrypt.hash(decodeURI(passArray[1]), 10).then((hash) => {
          userData.password = hash;
          console.log(hash)
        });
        res.status(200).send({ message: "Данные успешно обновлены" });
      } else {
        res.send({ message: "Что-то пошло не так, проверьте введенные данные" });
      }
    });
  }
});

server.delete("/users", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const users = db.users.filter((user) => user.id !== payload.id);
  db.users = users;
  res.status(200).send({ message: "Ваш аккаунт удалён" });
});

server.get("/contacts", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const contactList = db.contacts.filter(
    (contact) => contact.ownerId === user.id
  );
  const visibleContactListData = contactList.map((item) => {
    const { name, email, avatar, phones, quote, id } = item;
    return { name, email, avatar, phones, quote, id };
  });
  res.status(200).send(visibleContactListData);
});

server.post("/contacts", (req, res) => {
  const { name, email, avatar, phones, quote, id } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const ids = db.contacts.map((i) => +i.id);
  const idCounter = Math.max(...ids) + 1;
  let phoneNumbers;

  const newContact = {
    id: decodeURI(id) || idCounter.toString(),
    ownerId: user.id,
  }

  if (phones) {
    const stringifyArray = phones.split("~");
    const phonesArray = stringifyArray.map((phone) => decodeURI(phone));
    const clearedArray = phonesArray.filter((phone) => phone !== '')
    phoneNumbers = clearedArray;
  }

  if (name) {
    newContact.name = decodeURI(name);
  }

  if (email) {
    newContact.email = decodeURI(email);
  }

  if (avatar) {
    newContact.avatar = decodeURI(avatar);
  }

  if (quote) {
    newContact.quote = decodeURI(quote);
  }

  newContact.phones = phoneNumbers

  db.contacts.push(newContact);
  res.status(201).send({ message: "Контакт добавлен" });
});

server.patch("/contacts", (req, res) => {
  const { name, email, avatar, phones, quote, id } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);

  if (!id) {
    res.send({ message: "У вас нет прав для совершения данной операции" });
  }
  const userData = db.contacts.find((contact) => contact.id === id);

  if (!userData) {
    res.send({ message: "Запрос не корректен, данный контакт отсутствует" });
  }

  if (userData.ownerId === user.id) {
    if (name) {
      userData.name = decodeURI(name);
    }

    if (email) {
      userData.email = decodeURI(email);
    }

    if (avatar) {
      userData.avatar = decodeURI(avatar);
    }

    if (phones) {
      const stringifyArray = phones.split("~");
      const phonesArray = stringifyArray.map((phone) => decodeURI(phone));
      userData.phones = phonesArray;
    }

    if (quote) {
      userData.quote = decodeURI(quote);
    }
    res.status(200).send({ message: "Данные контакта обновлены успешно" });
  } else {
    res.send({ message: "У вас нет прав для совершения данной операции" });
  }
});

server.delete("/contacts", (req, res) => {
  const { id } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const currentContact = db.contacts.find((contact) => contact.id === id);

  if (!id) {
    res
      .status(400)
      .send({ message: "У вас нет прав для совершения данной операции" });
  }
  if (currentContact.ownerId === user.id) {
    const contacts = db.contacts.filter((contact) => contact.id !== id);
    db.contacts = contacts;
    res.status(200).send({ message: "Контакт удалён" });
  } else {
    res
      .status(400)
      .send({ message: "У вас нет прав для совершения данной операции" });
  }
});

server.post("/friends", (req, res) => {
  const { email } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const currentFriend = db.users.find(
    (user) => user.email === decodeURI(email)
  );

  if (!currentFriend) {
    res.status(400).send({ message: "Такой пользователь не зарегистрирован" });
  }
  if(!userData.friends.find((friend) => friend === currentFriend.email)){
    userData.friends.push(currentFriend.email);
    res
      .status(200)
      .send({ message: "Пользователь добавлен в список ваших контактов" });
  }
});

server.delete("/friends", (req, res) => {
  const { email } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const currentFriend = userData.friends.find((user) => user.email === email);
  if (!currentFriend) {
    res.send({ message: "Такой пользователь не зарегистрирован" });
  }
  const newFriendList = userData.friends.filter((user) => user !== email);
  userData.friends = newFriendList;
  res.status(200).send({ message: "Пользователь удален из друзей" });
});

server.get("/me", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const { name, email, avatar, phones, friends } = userData;
  let friendsData = []
  if (friends) {
  friendsData = friends.map((id) => {
    const current = db.users.find((user) => user.email === id);
    const { name, email, avatar, phones } = current
    const data = { name, email, avatar, phones }
    return data
  })
}
  res.status(200).send({ name, email, avatar, phones, friends: friendsData });
});

server.use(router);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
