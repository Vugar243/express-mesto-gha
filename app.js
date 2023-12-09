// app.js
const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// Подключение роутов для пользователей

app.post('/signin', login);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.listen(PORT);
