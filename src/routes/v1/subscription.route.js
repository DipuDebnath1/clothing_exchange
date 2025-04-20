const express = require("express")
const router = express.Router()
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const { createSubscriptionValidation, updateSubscriptionValidation } = require("../../validations/subscription.validation");
const { CreateSubscription, AllSubscription, SingleSubscription, UpdateSubscription, DeleteSubscription, RestoreSubscription, SubscriptionStatusUpdate } = require("../../controllers/subscription.controller");



router.post('/create', auth("admin"), validate(createSubscriptionValidation), CreateSubscription)
router.get('/', auth("common"),  AllSubscription)
router.get('/:id', auth("common"),  SingleSubscription)
router.put('/:id', auth("admin"), validate(updateSubscriptionValidation), UpdateSubscription)
router.delete('/:id', auth("admin"),  DeleteSubscription)
router.post('/restore/:id', auth("admin"),  RestoreSubscription)
router.post('/update_status/:id', auth("admin"), validate(updateSubscriptionValidation),  SubscriptionStatusUpdate)

module.exports = router
