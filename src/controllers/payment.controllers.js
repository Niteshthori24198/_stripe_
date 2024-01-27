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

