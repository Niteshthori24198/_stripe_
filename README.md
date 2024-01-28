## Portone_Stripe_Assignment

## Description

This project implements backend APIs for Stripe Payment Gateway integration. It provides functionality to create payment intents, capture intents, create refunds, and get a list of all intents using the Stripe API.


## Installation

1. Clone the github repository :
   
         git clone https://github.com/Niteshthori24198/portone_stripe_assignment
         
         cd your-repo
   

2. Install dependencies :

         npm install


3. Set up Stripe Sandbox Account :

   - Create an account on [Stripe Dashboard](https://dashboard.stripe.com/register).

   - Obtain your Stripe Access Keys and Secret Keys.


4. Create a `.env` file in the root directory :

         PORT = 3000  
         STRIPE_PUBLIC_KEY = add your-stripe-public-key
         STRIPE_SECRET_KEY = add your-stripe-secret-key
   

## Usage

1. Run the application using one of mentioned command :
   ```bash
   npm run start
   npm run server
   ```

2. APIs Documentation :
  

| API Endpoint                       | HTTP Method | Description                                      |
| -----------------------------------|-------------|--------------------------------------------------|
| `/payment/api/v1/create-payment_intent`      | POST        | Create Intent for Payment                        |
| `/payment/api/v1/capture-payment_intent/:id` | POST | Capture Payment Intent with specified ID    |
| `/payment/api/v1/create-refund/:id`   | POST        | Create Refund for Payment with specified ID      |
| `/payment/api/v1/list-payment_intent` | GET         | Get List of Payment Intents                      |



## Testing

1. Run unit tests:
   ```bash
   npm test
   ```


## References

- [Stripe API Docs](https://stripe.com/docs/api/payment_intents)

## Contributors

-  Nitesh Kumar

<h2 align="center">Thank You 💖</h2>



