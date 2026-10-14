
import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js"

import {
    createPaymentOrder,
    verifyPayment
} from "../controllers/OrderController.js";

const PaymentRoutes = express.Router();

PaymentRoutes.post(
    "/create-order",
    isAuthenticated,
    createPaymentOrder
);

PaymentRoutes.post(
    "/verify",
    isAuthenticated,
    verifyPayment
);

export default PaymentRoutes;
