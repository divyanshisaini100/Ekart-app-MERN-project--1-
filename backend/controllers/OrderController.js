
import Razorpay from "razorpay";
import crypto from "crypto";
import CartModel from "../models/CartModel.js";
import OrderModel from "../models/OrderModel.js";
import dotenv from "dotenv";

dotenv.config();

console.log(
    "Razorpay key loaded:",
    Boolean(process.env.RAZORPAY_KEY_ID)
);

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async function (req, res) {
    try {
        const userid = req.user._id;
        // Fetch the authenticated user's cart and its products
        const cart = await CartModel.find({ userid })
            .populate("productid");

        if (cart.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let subtotal = 0;
        const items = [];

        for (const item of cart) {
            const product = item.productid;

            if (!product) {
                return res.status(400).json({
                    message: "A product in your cart no longer exists"
                });
            }

            if (
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                item.quantity > product.inventory
            ) {
                return res.status(400).json({
                    message: `Invalid quantity or insufficient stock for ${product.name_}`
                });
            }

            subtotal += product.price * item.quantity;

            // Save a snapshot of what the customer ordered
            items.push({
                productid: product._id,
                name: product.name_,
                price: product.price,
                quantity: item.quantity,
                selectedColor: item.selectedColor || "",
                selectedSize: item.selectedSize || ""
            });
        }

        // Match these calculations to Ekart's checkout rules.
        // Current example: 5% estimated tax and free shipping.
        const tax = subtotal * 0.05;
        const totalRupees = Math.round((subtotal + tax) * 100) / 100;
        const amountPaise = Math.round(totalRupees * 100);

        // Create the order with Razorpay on the server
        const razorpayOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: `ekart_${Date.now()}`
        });

        // Save Ekart's own order record
        const order = await OrderModel.create({
            userid,
            items,
            amount: amountPaise,
            currency: "INR",
            razorpayOrderId: razorpayOrder.id,
            status: "pending"
        });

        return res.status(201).json({
            message: "Payment order created",
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            ekartOrderId: order._id
        });

    } catch (err) {
        console.error("CREATE PAYMENT ORDER:", err.message);

        return res.status(500).json({
            message: "Unable to create payment order"
        });
    }
};


export const verifyPayment = async function (req, res) {
    try {
        const userid = req.user._id;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment verification details are required"
            });
        }

        // Only verify an order belonging to this user
        const order = await OrderModel.findOne({
            userid,
            razorpayOrderId: razorpay_order_id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status === "paid") {
            return res.status(200).json({
                message: "Payment already verified",
                orderId: order._id
            });
        }

        // Generate the expected signature on the server
        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const expected = Buffer.from(expectedSignature, "hex");
        const received = Buffer.from(razorpay_signature, "hex");

        if (
            expected.length !== received.length ||
            !crypto.timingSafeEqual(expected, received)
        ) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        
        order.razorpayPaymentId = razorpay_payment_id;
        order.status = "paid";
        await order.save();

        // Clear the user's cart only after payment is verified
        await CartModel.deleteMany({ userid });

        return res.status(200).json({
            message: "Payment verified successfully",
            orderId: order._id
        });


    } catch (err) {
        console.error("VERIFY PAYMENT:", err.message);

        return res.status(500).json({
            message: "Unable to verify payment"
        });
    }
};
