const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

router.get('/', salesController.getSales);
router.get('/stats', salesController.getStats); // Optional: for dashboard stats

module.exports = router;
