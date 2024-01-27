require('dotenv').config();
const paymentRouter = require('./routes/payment.routes');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    return res.status(200).send({ message: 'Welcome to Portone API 💖' })
})

app.use('/payment/api/v1', paymentRouter);

app.use('/*', (req, res) => {
    return res.status(404).send({ Error: 'Page not found' })
})

app.use((err, req, res, next) => {
    return res.status(err.status || 500).send({ Error: err.message || 'Internal Server Error' })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${process.env.PORT}`)
})


module.exports = app;