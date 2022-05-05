const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");
const auth = require("./auth");

const JWT_SECRET = "JWT_SECRET";

const db = {
  users: [
    {
      name: "Колобок",
      email: "Kolobok@gmail.com",
      password: "Kolobok123",
      avatar: 'https://proza.ru/pics/2014/05/10/1565.jpg',
      id: 1,
      friends: [],
    },
    {
      name: "Медведь",
      email: "Bear@gmail.com",
      password: "Bear123",
      avatar: 'https://sportishka.com/uploads/posts/2021-11/1638301090_3-sportishka-com-p-medved-kachok-krasivie-foto-silovie-vidi-s-3.jpg',
      id: 2,
      friends: [],
    },
    {
      name: "Лисица",
      email: "Fox@gmail.com",
      password: "Fox123",
      avatar: 'https://cs14.pikabu.ru/post_img/2022/01/12/10/1642007349154723555.jpg',
      id: 3,
      friends: [],
    },
    {
      name: "Loki87by",
      email: "loki87.666@gmail.com",
      password: "123123123",
      avatar: 'https://avatars.githubusercontent.com/u/61252310?v=4',
      phones: ["+79955935756"],
      id: 4,
      friends: [],
    },
  ],
  contacts: [
    {
      id: 1,
      ownerId: 1,
      name: "Бабушка",
      email: "grandMa@mail.ru",
      avatar: 'http://s11.pikabu.ru/post_img/big/2020/09/23/7/16008554511492692.jpg',
      phones: ["+79214567890"],
      quote: "Трубку не брать, будет плакаться, что ушел.",
    },
    {
      id: 2,
      ownerId: 1,
      name: "Дедушка",
      email: "grandFa@mail.ru",
      avatar: 'https://cdnb.artstation.com/p/assets/images/images/032/967/687/large/eduard-nabiullin-1.jpg?1608016734',
      phones: ["+79954567890"],
      quote: "Трубку не брать, будет проклинать, что ушел.",
    },
    {
      id: 3,
      ownerId: 2,
      name: "Заяц",
      email: "rabbit@gmail.com",
      avatar: 'https://cs5.pikabu.ru/images/big_size_comm/2014-10_3/14133542518215.jpg',
      phones: "",
      quote: "Иногда приносит еду, чтоб защитил от волка с лисой",
    },
    {
      id: 4,
      ownerId: 3,
      name: "Волк",
      email: "wolf@gmail.com",
      avatar: 'https://pxlprint.ru/wp-content/uploads/2014/09/stark.png',
      phones: "",
      quote: "Серый глупец",
    },
  ],
};

const server = jsonServer.create();
const router = jsonServer.router(db);

const PORT = 3000;

server.post("/registration", (req, res) => {
  const { name, email, password } = req.query;

  if (db.users.find((user) => user.email === email)) {
    return res.status(409).send("Пользователь с таким email уже существует.");
  }

  if(name, email, password) {
    const ids = db.users.map((i) => i.id)
  const idCounter = Math.max(...ids) + 1;
  const newUser = {
    name: name,
    email: email,
    password: password,
    id: idCounter,
    contacts: [],
  };
  db.users.push(newUser);
  res
    .header("Content-Type", "application/json")
    .status(201)
    .send(JSON.stringify(newUser));
} else {
    res.status(400).send('Введены не все или некорректные данные')
}
});

server.post("/users", (req, res) => {
  res.status(404).send("Этот номер не пройдёт, регистрируйтесь по правилам");
});

server.post("/login", (req, res) => {
  const { email, password } = req.query;

  if(email, password) {
  const currentUser = db.users.find((user) => user.email === email);

  if (!currentUser) {
    return res.status(404).send("Такой пользователь не зарегистрирован.");
  }

  if (currentUser.password === password) {
    const token = jwt.sign({ id: currentUser.id }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({ token });
  } else {
    res.status(401).send("Неправильные почта или пароль");
  }} else {
    res.status(400).send('Введены не все или некорректные данные')}
});

server.use(auth);

server.patch("/users", (req, res) => {
  const { name, email, password, avatar, phones } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);

  if (name) {
    userData.name = name;
  }

  if (email) {
    userData.email = email;
  }

  if (password) {
    userData.password = password;
  }

  if (avatar) {
    userData.avatar = avatar;
  }

  if (phones) {
    userData.phones = phones;
  }
  res.status(200).send(userData);
});

server.delete("/users", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const users = db.users.filter((user) => user.id !== payload.id);
  db.users = users;
  res.status(200).send("Ваш аккаунт удалён");
});

server.get("/contacts", (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const contactList = db.contacts.filter(
    (contact) => contact.ownerId === user.id
  );
  res.status(200).send(contactList);
});

server.post("/contacts", (req, res) => {
  const { name, email, avatar, phones, quote } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const ids = db.contacts.map((i) => i.id)
const idCounter = Math.max(...ids) + 1;
  const newContact = {
    ownerId: user.id,
    name: name,
    email: email,
    avatar: avatar,
    phones: phones,
    id: idCounter,
    quote: quote,
  };
  db.contacts.push(newContact);
  res.status(201).send(newContact);
});

server.patch("/contacts", (req, res) => {
  const { name, email, avatar, phones, quote, id } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  if (!id) {
    res.status(400).send("У вас нет прав для совершения данной операции");
  }
  const userData = db.contacts.find((contact) => contact.id === +id);

  if (userData.ownerId === user.id) {
    if (name) {
      userData.name = name;
    }

    if (email) {
      userData.email = email;
    }

    if (avatar) {
      userData.avatar = avatar;
    }

    if (phones) {
      userData.phones = phones;
    }

    if (quote) {
      userData.quote = quote;
    }
    res.status(200).send(userData);
  } else {
    res.status(400).send("У вас нет прав для совершения данной операции");
  }
});

server.delete("/contacts", (req, res) => {
  const { id } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const currentContact = db.contacts.find((contact) => contact.id === +id);

  if (!id) {
    res.status(400).send("У вас нет прав для совершения данной операции");
  }
  if (currentContact.ownerId === user.id) {
    const contacts = db.contacts.filter((contact) => contact.id !== +id);
    db.contacts = contacts;
    res.status(200).send("Контакт удалён");
  } else {
    res.status(400).send("У вас нет прав для совершения данной операции");
  }
});

server.post("/friends", (req, res) => {
  const { email } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const currentFriend = db.users.find((user) => user.email === email);

  if(!currentFriend) {
    res.status(400).send('Такой пользователь не зарегистрирован')
  }
  const friendData = {
    name: currentFriend.name,
email: currentFriend.email,
avatar: currentFriend.avatar,
phones: currentFriend.phones,
  }
  userData.friends.push(friendData);
  res.status(200).send(userData);
});

server.patch("/friends", (req, res) => {
  const { email, avatar, phones, quote } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const currentFriend = userData.friends.find((user) => user.email === email);
  if(!currentFriend) {
    res.status(400).send('Такой пользователь не зарегистрирован')
  }

  if(avatar) {
    currentFriend.avatar = avatar
  }

  if(phones) {
    currentFriend.phones = phones
  }

  if(quote) {
    currentFriend.quote = quote
  }
  res.status(200).send(userData);
});

server.delete("/friends", (req, res) => {
  const { email } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const payload = jwt.verify(token, JWT_SECRET);
  const userData = db.users.find((user) => user.id === payload.id);
  const currentFriend = userData.friends.find((user) => user.email === email);
  if(!currentFriend) {
    res.status(400).send('Такой пользователь не зарегистрирован')
  }
  const newFriendList = userData.friends.filter((user) => user.email !== email);
  userData.friends = newFriendList
  res.status(200).send('Пользователь удален из друзей');
});

server.use(router);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

//TODO: add url-decoder
// add pass-hash && hide id in get.users
