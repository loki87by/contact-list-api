const jwt = require("jsonwebtoken");
const JWT_SECRET = "JWT_SECRET";

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Необходима авторизация" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: "Сначала нужно авторизоваться" });
  }
  req.user = payload;
  next();
};
