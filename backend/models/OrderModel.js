
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },

        items: [
            {
                productid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "ProductModel",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                selectedColor: {
                    type: String,
                    default: ""
                },
                selectedSize: {
                    type: String,
                    default: ""
                }
            }
        ],

        amount: {
            type: Number,
            required: true
        },

        currency: {
            type: String,
            default: "INR"
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true
        },

        razorpayPaymentId: {
            type: String,
            default: null
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", OrderSchema);

export default OrderModel;
