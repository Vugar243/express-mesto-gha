// utils/errorHandler.js

const handleError = (err, res) => {
  let ERROR_CODE;

  if (err.name === 'ValidationError') {
    ERROR_CODE = 400;
  } else if (err.name === 'CastError') {
    ERROR_CODE = 400;
  } else {
    ERROR_CODE = 500;
  }
  res.status(ERROR_CODE).send({ message: `Ошибка: ${err}` });
};

module.exports = handleError;
