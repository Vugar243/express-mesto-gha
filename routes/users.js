// routes/users.js
const router = require('express').Router();
const {
  getUsers, getUserById, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

// Роуты для пользователей
router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/me', updateUserProfile);
router.patch('/users/me/avatar', updateUserAvatar);
router.get('/users/me', getCurrentUser);

module.exports = router;
