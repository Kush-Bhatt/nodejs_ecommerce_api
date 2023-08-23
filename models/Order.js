import mongoose from "mongoose";
const Schema = mongoose.Schema;

// generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toUpperCase();
const randomNum = Math.floor(1000 + Math.random() * 90000);

const orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        orderItems: [
            {
                type: Object,
                required: true
            }
        ],
        shippingAddress: {
            type: Object,
            required: true
        },
        orderNumber: {
            type: String,
            default: randomTxt + randomNum
        },

        // For Stripe Payment
        paymentStatus: {
            type: String,
            default: "Not paid"
        },
        paymentMethod: {
            type: String,
            default: "Not specified"
        },
        totalPrice: {
            type: Number,
            default: 0.0
        },
        currency: {
            type: String,
            default: "Not specified"
        },

        // For admin
        status: {
            type: String,
            default: "Pending",
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered']
        },
        deliveredAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;