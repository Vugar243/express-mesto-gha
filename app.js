// app.js
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
// Middleware для временного решения авторизации
app.use((req, res, next) => {
  // Жестко захардкоженный _id пользователя
  req.user = {
    _id: '656a3004eb72cd2000f4d747',
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Подключение роутов для пользователей
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.listen(PORT);
