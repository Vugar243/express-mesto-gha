// utils/errorHandler.js
const handleError = (err, res) => {
  let statusCode;

  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'CastError') {
    statusCode = 400;
  } else if (err.code === 11000) {
    statusCode = 409;
  } else {
    statusCode = 500;
  }

  res.status(statusCode).send({ message: `Ошибка: ${err.message || 'Внутренняя ошибка сервера'}` });
};

module.exports = handleError;
