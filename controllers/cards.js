// controllers/cards.js
const Card = require('../models/card');

// Функция обработки ошибок
const handleError = (err, res) => {
  let ERROR_CODE;
  if (err.name === 'ValidationError') {
    ERROR_CODE = 400;
  } else if (err.name === 'CastError') {
    ERROR_CODE = 404;
  } else {
    ERROR_CODE = 500;
  }
  res.status(ERROR_CODE).send({ message: `Ошибка: ${err}` });
};

// Контроллер для получения всех карточек
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, res));
};

// Контроллер для создания карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // Использую _id пользователя из req.user

  if (!name || !link) {
    const ERROR_CODE = 400;
    return res.status(ERROR_CODE).send({ message: 'Поля "name" и "link" обязательны для заполнения' });
  }

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));

  return null;
};

// Контроллер для удаления карточки по ID
module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        const ERROR_CODE = 404;
        return res.status(ERROR_CODE).send({ message: 'Карточка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => handleError(err, res));
  return null;
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
  return null;
};

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => handleError(err, res));
  return null;
};
