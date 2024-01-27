
const { Router } = require("express");
const paymentRouter = Router();

const {
    createPaymentIntent,
    capturePaymentIntent,
    createPaymentRefund,
    listingAllPaymentIntent
} = require("../controllers/payment.controllers");


paymentRouter.post('/create-payment_intent', createPaymentIntent);

paymentRouter.post('/capture-payment_intent/:id', capturePaymentIntent);

paymentRouter.post('/create-refund/:id', createPaymentRefund);

paymentRouter.get('/list-payment_intent', listingAllPaymentIntent);

module.exports = paymentRouter;