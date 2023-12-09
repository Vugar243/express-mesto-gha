// controllers/users.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const handleError = require('../utils/errorHandler');

// Контроллер для получения всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, res));
};

// Контроллер для получения пользователя по ID
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('User not found'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => handleError(err, res));
};
// Контроллер для создания пользователя
exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  // Проверка наличия обязательных полей
  if (!email || !password) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поля "email" и "password" обязательны для заполнения' });
  }

  // Хеширование пароля перед сохранением в базу
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      email,
      password: hashedPassword,
      name: name || 'Жак-Ив Кусто',
      about: about || 'Исследователь',
      avatar: avatar || 'https://example.com/default-avatar.jpg',
    }))
    .then((user) => {
      const userWithoutPassword = { ...user.toObject(), password: undefined };
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      handleError(err, res);
    });
  return null;
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

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
  return null;
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

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res));
  return null;
};
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Проверка наличия обязательных полей
  if (!email || !password) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поля "email" и "password" обязательны для заполнения' });
  }

  // Найти пользователя по email
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      // Проверка существования пользователя и сравнение пароля
      if (!user || !bcrypt.compareSync(password, user.password)) {
        const error = new Error('Неправильные почта или пароль');
        error.statusCode = 401;
        throw error;
      }

      // Создание JWT токена
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' },
      );

      // Отправка токена клиенту
      res.cookie('jwt', token, {
        maxAge: 604800000, // 7 дней в миллисекундах
        httpOnly: true,
        sameSite: 'None', // Для работы с CORS
        secure: true, // Требуется для работы с HTTPS
      });

      res.send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      handleError(err, res);
    });
  return null;
};
// GET /users/me - возвращает информацию о текущем пользователе
module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      res.send(user);
    })
    .catch((err) => {
      handleError(err, res);
    });
  return null;
};
