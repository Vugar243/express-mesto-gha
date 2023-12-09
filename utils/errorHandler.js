// utils/errorHandler.js

const handleError = (err, res) => {
  let statusCode;
  let errorMessage;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = err.message || 'Некорректные данные';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorMessage = 'Некорректный формат данных';
  } else if (err.code === 11000) {
    statusCode = 409;
    errorMessage = 'Данные уже существуют';
  } else {
    statusCode = 500;
    errorMessage = 'На сервере произошла ошибка';
  }

  res.status(statusCode).send({ message: `Ошибка: ${errorMessage}` });
};

module.exports = handleError;
