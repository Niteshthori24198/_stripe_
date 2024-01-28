require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


/**
 * Asynchronously creates a payment intent using the provided request body, 
 * sends the payment intent in the response, and handles errors by passing 
 * them to the next middleware.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @return {Object} the payment intent in the response
 */

const createPaymentIntent = async (req, res, next) => {

    const { email, amount } = req.body;

    try {

        // Creating a Customer
        const customer = await stripe.customers.create({
            email: email,
        });

        // Creating a payment method using test card token
        const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                token: "tok_visa",
            },
        });

        // Attaching the payment method to teh customer
        await stripe.paymentMethods.attach(paymentMethod.id, {
            customer: customer.id,
        });

        // Creating Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'inr',
            customer: customer.id,
            payment_method: "pm_card_visa",
            confirmation_method: "manual",
            description: "Payment for your order from portone",
            use_stripe_sdk: true,
            confirm: false
        });

        return res.status(200).send({ paymentIntent });

    } catch (err) {
        next(err)
    }
}

/**
 * Capture a payment intent with the given ID, handle any required actions, and return the captured payment intent.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @return {Promise} A Promise that resolves to the captured payment intent
 */

const capturePaymentIntent = async (req, res, next) => {

    const { id } = req.params;

    try {

        // Confirming a payment with a return_url
        const confirmedIntent = await stripe.paymentIntents.confirm(id, {
            return_url: 'https://www.youtube.com/',
        });

        // If the PaymentIntent requires action, handle the next steps

        if (confirmedIntent.status === 'requires_action') {

            // In a real-world scenario, you might redirect the user to a 3D Secure authentication page
            // You can use confirmedIntent.next_action.redirect_to_url.url for the redirection

            return res.status(200).send({
                requires_action: true,
                next_action: confirmedIntent.next_action,
            });
        }

        // If the PaymentIntent does not require action, proceed with capturing

        const capturedIntent = await stripe.paymentIntents.capture(id);

        return res.status(200).send({ paymentIntent: capturedIntent });

    } catch (err) {
        next(err);
    }
};


/**
 * Asynchronously creates a payment refund using the provided request, response, and next objects.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {function} next - the next function
 * @return {Promise<void>} a promise that resolves once the payment refund is created
 */
const createPaymentRefund = async (req, res, next) => {

    const { id } = req.params;

    try {

        // Retrieve PaymentIntent details
        const paymentIntent = await stripe.paymentIntents.retrieve(id);

        // Check if the PaymentIntent requires action
        if (paymentIntent.status === 'requires_action') {

            // The PaymentIntent requires action, return an appropriate response

            return res.status(400).send({
                Error: "This PaymentIntent requires additional action from the customer.",
                next_action: paymentIntent.next_action,
            });
        }

        // Check if the PaymentIntent has a successful charge
        const charges = paymentIntent.charges.data;

        if (charges.length > 0 && charges[0].status === 'succeeded') {

            // Create a Refund using payment intent id
            const refund = await stripe.refunds.create({ payment_intent: id });

            return res.status(200).send({ refund });

        } else {

            return res.status(400).send({ Error: "This PaymentIntent does not have a successful charge to refund." });
        }

    } catch (err) {
        next(err);
    }
};


/**
 * Asynchronously lists all payment intents and sends the result in the response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 * @return {Promise} A Promise that resolves to the result of sending the payment intents in the response
 */

const listingAllPaymentIntent = async (req, res, next) => {

    try {

        const paymentIntents = await stripe.paymentIntents.list();

        res.status(200).send({ paymentIntents });

    } catch (err) {
        next(err);
    }
}



module.exports = { createPaymentIntent, capturePaymentIntent, createPaymentRefund, listingAllPaymentIntent }