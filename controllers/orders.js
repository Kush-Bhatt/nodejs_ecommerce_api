import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * @desc Create Orders
 * @route POST api/v1/orders
 * @access Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    // get payload(customer, orderItems, shippingAddress, totalPrice)
    const { orderItems, shippingAddress, totalPrice } = req.body;
    // find user
    const user = await User.findById(req.userAuthId);

    if (!user?.hasShippingAddress) {
        throw new Error('Please provide shipping address');
    }

    // check if order is not empty
    if (!orderItems || orderItems?.length == 0) {
        throw new Error('No Order items.');
    }

    // place/create order - saving
    const order = await Order.create({
        user: req.userAuthId,
        orderItems,
        shippingAddress,
        totalPrice
    });

    // update productQty & quantitySold
    orderItems?.map(async (order) => {
        const product = await Product.findById(order.productId);
        if (product)
            product.totalSold += order.qty
        await product.save();
    });

    // push order into user
    user.orders.push(order?._id);
    await user.save();

    // make payment (stripe)
    // payment webhook
    // update user order

    res.json({
        success: true,
        message: 'Order Created',
        order,
        user
    });
});