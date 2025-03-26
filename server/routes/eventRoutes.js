const express = require('express');
const router = express.Router();
const { protect, restrictToAdmin } = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);

// Protected routes (admin only)
router.use(protect);
router.use(restrictToAdmin);

router.post('/',
  uploadMiddleware.array('images', 5),
  eventController.createEvent
);

router.patch('/:id',
  uploadMiddleware.array('images', 5),
  eventController.updateEvent
);

router.delete('/:id', eventController.deleteEvent);

router.post('/:id/register', eventController.registerForEvent);

// Admin only routes
//router.patch('/:id/feature', eventController.toggleFeatureEvent);

module.exports = router;
