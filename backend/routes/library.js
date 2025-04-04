const express = require('express');
const router = express.Router();
const itemController = require('../controllers/library/itemController');
const borrowingController = require('../controllers/library/borrowingController');
const { librarianAccess } = require('../middleware/roleMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

// Item routes
router.route('/items')
  .get(itemController.getAllItems)
  .post(librarianAccess, itemController.createItem);

router.route('/items/:id')
  .get(itemController.getItem)
  .patch(librarianAccess, itemController.updateItem)
  .delete(librarianAccess, itemController.deleteItem);

// Circulation routes
router.post('/items/:id/checkout', librarianAccess, itemController.checkoutItem);
router.post('/items/:id/return', librarianAccess, itemController.returnItem);
router.post('/items/:id/renew', librarianAccess, itemController.renewItem);
router.post('/items/:id/reserve', librarianAccess, itemController.reserveItem);
router.post('/items/:id/cancel-reservation', librarianAccess, itemController.cancelReservation);
router.post('/items/:id/mark-lost', librarianAccess, itemController.markAsLost);

// Statistics routes
router.get('/statistics/items', itemController.getItemStatistics);
router.get('/items/due', librarianAccess, itemController.getDueItems);

// Borrowing record routes
router.route('/borrowings')
  .get(borrowingController.getAllBorrowingRecords)
  .post(librarianAccess, borrowingController.createBorrowingRecord);

router.route('/borrowings/:id')
  .get(borrowingController.getBorrowingRecord);

router.post('/borrowings/:id/return', librarianAccess, borrowingController.returnItem);
router.post('/borrowings/:id/renew', librarianAccess, borrowingController.renewLoan);
router.post('/borrowings/:id/damage', librarianAccess, borrowingController.recordDamage);
router.post('/borrowings/:id/payment', librarianAccess, borrowingController.registerPayment);
router.post('/borrowings/:id/waive-fee', librarianAccess, borrowingController.waiveFee);
router.post('/borrowings/:id/lost', librarianAccess, borrowingController.markAsLost);
router.post('/borrowings/:id/reminder', librarianAccess, borrowingController.addReminderSent);

// Borrower history routes
router.get('/borrowers/:borrowerId/history', borrowingController.getBorrowerHistory);
router.get('/borrowers/:borrowerId/active', borrowingController.getActiveCheckouts);

// Overdue and due-soon reports
router.get('/borrowings/overdue', librarianAccess, borrowingController.getOverdueItems);
router.get('/borrowings/due-soon', librarianAccess, borrowingController.getItemsDueSoon);

// Borrowing statistics
router.get('/statistics/borrowings', borrowingController.getBorrowingStatistics);

module.exports = router; 