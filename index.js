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
      id: 1,
      friends: [],
    },
    {
      name: "Медведь",
      email: "Bear@gmail.com",
      password: "Bear123",
      id: 2,
      friends: [],
    },
    {
      name: "Лисица",
      email: "Fox@gmail.com",
      password: "Fox123",
      id: 3,
      friends: [],
    },
    {
      name: "Loki87by",
      email: "loki87.666@gmail.com",
      password: "123123123",
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
      phones: ["+79214567890"],
      email: "grandMa@mail.ru",
      quote: "Трубку не брать, будет плакаться, что ушел.",
    },
    {
      id: 2,
      ownerId: 1,
      name: "Дедушка",
      phone: ["+79954567890"],
      email: "grandFa@mail.ru",
      quote: "Трубку не брать, будет проклинать, что ушел.",
    },
    {
      id: 3,
      ownerId: 2,
      name: "Заяц",
      phone: "",
      email: "rabbit@gmail.com",
      quote: "Иногда приносит еду, чтоб защитил от волка с лисой",
    },
    {
      id: 4,
      ownerId: 3,
      name: "Волк",
      phone: "",
      email: "wolf@gmail.com",
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

  if ((name, email, password)) {
    const ids = db.users.map((i) => i.id);
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
    res.status(400).send("Введены не все или некорректные данные");
  }
});

server.post("/users", (req, res) => {
  res.status(404).send("Этот номер не пройдёт, регистрируйтесь по правилам");
});

server.post("/login", (req, res) => {
  const { email, password } = req.query;

  if ((email, password)) {
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
    }
  } else {
    res.status(400).send("Введены не все или некорректные данные");
  }
});

server.use(auth);

server.patch("/users", (req, res) => {
  const { name, email, password, phones } = req.query;
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
  const { name, email, phones, quote } = req.query;
  const { authorization } = req.headers;
  const token = authorization.replace("Bearer ", "");
  const user = jwt.verify(token, JWT_SECRET);
  const ids = db.contacts.map((i) => i.id);
  const idCounter = Math.max(...ids) + 1;
  const newContact = {
    ownerId: user.id,
    name: name,
    email: email,
    phones: phones,
    id: idCounter,
    quote: quote,
  };
  db.contacts.push(newContact);
  res.status(201).send(newContact);
});

server.patch("/contacts", (req, res) => {
  const { name, email, phones, quote, id } = req.query;
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

server.use(router);
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

//TODO: add url-decoder
