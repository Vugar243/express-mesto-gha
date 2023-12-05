// controllers/users.js
const User = require('../models/user');

// Функция обработки ошибок
const handleError = (err, res) => {
  const ERROR_CODE = err.name === 'ValidationError' ? 400 : err.name === 'CastError' ? 404 : 500;
  res.status(ERROR_CODE).send({ message: `Ошибка: ${err}` });
};

// Контроллер для получения всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

// Контроллер для получения пользователя по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        const ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => handleError(err, res));
};

// Контроллер для создания пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  // Проверка наличия обязательных полей
  if (!name || !about || !avatar) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поля "name", "about" и "avatar" обязательны для заполнения' });
  }

  const owner = req.user._id;

  User.create({ name, about, avatar, owner })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));

  // Добавленные переносы строк
  return res.status(200).send({ message: 'Пользователь успешно создан' });
};

// PATCH /users/me — обновляет профиль пользователя
module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  // Проверка наличия обязательных полей
  if (!name || !about) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поля "name" и "about" обязательны для заполнения' });
  }

  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
  return res.status(200).send({ message: 'Профиль пользователя успешно обновлен' });
};

// PATCH /users/me/avatar — обновляет аватар пользователя
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  // Проверка наличия обязательного поля
  if (!avatar) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поле "avatar" обязательно для заполнения' });
  }

  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
  return res.status(200).send({ message: 'Аватар пользователя успешно обновлен' });
};
