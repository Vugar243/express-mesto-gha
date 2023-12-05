// routes/cards.js
const router = require('express').Router();
const { getCards, createCard, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards');

// Роуты для карточек
router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCardById);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', dislikeCard);

module.exports = router;
