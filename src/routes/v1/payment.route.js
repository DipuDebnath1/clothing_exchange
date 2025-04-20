const express = require("express");
const validate = require("../../middlewares/validate");
const { paymentController } = require("../../controllers");
const { paymentValidation } = require("../../validations");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/booking_payment",
  auth("user"),
  validate(paymentValidation.BookSubEventPaymentValidation),
  paymentController.BookSubEventPayment
);
router.get("/today_income", auth("admin"), paymentController.TodayIncome);
router.get("/monthly_income", auth("admin"), paymentController.MonthlyIncome);
router.get("/transactions", auth("admin"), paymentController.AllTransaction);
router.get(
  "/transactions/:id",
  auth("admin"),
  paymentController.SingleTransaction
);
router.get("/subscribers", auth("admin"), paymentController.Subscribers);
router.get("/today_subscribers", auth("admin"), paymentController.TodaySubscribers);

router.post(
  "/subscription_payment",
  auth("user"),
  validate(paymentValidation.SubscriptionParchesPaymentValidation),
  paymentController.subscriptionPurchase
);

module.exports = router;

//
