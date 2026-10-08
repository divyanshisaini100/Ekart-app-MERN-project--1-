import {
    addToCart,
    updateCart,
    getCart,
    removeFromCart
} from "../controllers/CartController.js";

import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js"


const CartRoutes = express.Router();

CartRoutes.post("/:id", isAuthenticated, addToCart);

CartRoutes.get("/", isAuthenticated, getCart);

CartRoutes.patch("/:id", isAuthenticated, updateCart);

CartRoutes.delete("/:id", isAuthenticated, removeFromCart);

export default CartRoutes;