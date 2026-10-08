import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },

    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductModel",
        required: true
    },

    selectedColor: {
        type: String,
        default: ""
    },

    selectedSize: {
        type: String,
        default: ""
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }

}, {
    timestamps: true

});

const CartModel = mongoose.model("CartModel", CartSchema);

export default CartModel; 

