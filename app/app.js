import express from 'express';
import dbConnect from '../config/dbConnect.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import userRoutes from '../routes/users.js';
import productRoutes from '../routes/products.js';
import categoryRoutes from '../routes/categories.js';
import brandRoutes from '../routes/brands.js';
import colorRoutes from '../routes/colors.js';
import reviewRoutes from '../routes/reviews.js';
import orderRoutes from '../routes/orders.js';
import { globalErrHandler, notFound } from '../middlewares/globalErrHandler.js';

dotenv.config();
dbConnect();
const app = express();

// Stripe Webhook
const stripe = new Stripe(process.env.STRIPE_KEY)

// This is the Stripe CLI webhook secret key for testing the endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    console.log("Hello");
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log(event);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    console.log(event.type);
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        //update order
        console.log("Hii");
        const session = event.data.object;
        const { orderId } = session.metadata;
        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        const order = await Order.findByIdAndUpdate(orderId,
            {
                totalPrice: totalAmount / 100,
                currency,
                paymentMethod,
                paymentStatus
            },
            {
                new: true
            }
        );
        console.log(order);
    } else {
    }
    response.send();
});

app.use(express.json());
app.use(morgan('dev'));

//Routes Middlewares
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/colors', colorRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);

//Err Middlewares
app.use(notFound);
app.use(globalErrHandler);

export default app;