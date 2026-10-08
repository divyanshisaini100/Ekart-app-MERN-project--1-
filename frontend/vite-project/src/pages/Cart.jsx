import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Cart.module.css";
import Navbar from "../components/Navbar/Navbar.jsx";

const API_BASE =
    "https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev";

function Cart() {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE}/cart`,
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch cart"
                );
            }

            /*
                Cart only contains productid.
                So we fetch the actual product details
                for each cart item.
            */

            const itemsWithProducts = await Promise.all(
                data.cart.map(async (cartItem) => {

                    const productResponse = await fetch(
                        `${API_BASE}/products/${cartItem.productid}`
                    );

                    const productData = await productResponse.json();

                    if (!productResponse.ok) {
                        throw new Error(
                            productData.message ||
                            "Unable to fetch product"
                        );
                    }

                    return {
                        ...cartItem,
                        product: productData.product
                    };
                })
            );

            setCartItems(itemsWithProducts);

        } catch (err) {

            console.error(err);
            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCart();
    }, []);


    const updateQuantity = async (cartItemId, newQuantity) => {

    if (newQuantity < 1) {
        return;
    }

    try {

        console.log("Cart Item ID:", cartItemId);
        console.log("New Quantity:", newQuantity);
        console.log(
            "PATCH URL:",
            `${API_BASE}/cart/${cartItemId}`
        );

        const response = await fetch(
            `${API_BASE}/cart/${cartItemId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    quantity: newQuantity
                })
            }
        );

        console.log("Response status:", response.status);

        const data = await response.json();

        console.log("Response data:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update quantity"
            );
        }

        setCartItems((previousItems) =>
            previousItems.map((item) =>
                item._id === cartItemId
                    ? {
                        ...item,
                        quantity: data.cartItem.quantity
                    }
                    : item
            )
        );

    } catch (err) {

        console.error("UPDATE CART ERROR:", err);

        setError(err.message);
    }
};


    // Remove product from cart
    const removeFromCart = async (cartItemId) => {

        try {

            const response = await fetch(
                `${API_BASE}/cart/${cartItemId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to remove product"
                );
            }

            setCartItems((previousItems) =>
                previousItems.filter(
                    (item) => item._id !== cartItemId
                )
            );

        } catch (err) {

            console.error(err);
            setError(err.message);

        }
    };


    // Total number of physical items
    const totalQuantity = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );


    // Subtotal
    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );


    /*
        Demo tax rate for now.

        Later, you can replace this with your
        actual GST/tax calculation.
    */
    const taxRate = 0.05;

    const estimatedTax = subtotal * taxRate;

    const shipping = cartItems.length > 0 ? 0 : 0;

    const total = subtotal + estimatedTax + shipping;


    if (loading) {
        return (
            <div className={styles.status}>
                <p>Loading your cart...</p>
            </div>
        );
    }


    if (error && cartItems.length === 0) {
        return (
            <div className={styles.status}>
                <p>{error}</p>

                <button
                    onClick={fetchCart}
                    className={styles.retryButton}
                >
                    TRY AGAIN
                </button>
            </div>
        );
    }


    return (
        <>
        <Navbar />

        <div className={styles.cartPage}>

            {/* Header */}
            <header className={styles.cartHeader}>

                <div>
                    <h1>Your Cart</h1>

                    <p>
                        {totalQuantity}{" "}
                        {totalQuantity === 1 ? "item" : "items"}
                    </p>
                </div>

                {/* Checkout steps */}
                <div className={styles.steps}>

                    <div className={`${styles.step} ${styles.activeStep}`}>
                        <span>1</span>
                        <p>Cart</p>
                    </div>

                    <div className={styles.stepLine}></div>

                    <div className={styles.step}>
                        <span>2</span>
                        <p>Shipping</p>
                    </div>

                    <div className={styles.stepLine}></div>

                    <div className={styles.step}>
                        <span>3</span>
                        <p>Payment</p>
                    </div>

                </div>

            </header>


            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}


            {/* Empty cart */}

            {cartItems.length === 0 ? (

                <div className={styles.emptyCart}>

                    <h2>Your cart is empty</h2>

                    <p>
                        Looks like you haven't added anything
                        to your shopping bag yet.
                    </p>

                    <button
                        onClick={() => navigate("/products")}
                        className={styles.shopButton}
                    >
                        CONTINUE SHOPPING
                    </button>

                </div>

            ) : (

                <main className={styles.cartLayout}>

                    {/* LEFT SIDE */}

                    <section className={styles.cartItems}>

                        {cartItems.map((item) => {

                            const product = item.product;

                            const itemTotal =
                                product.price * item.quantity;

                            const isOutOfStock =
                                product.inventory <= 0;

                            const maxReached =
                                product.inventory > 0 &&
                                item.quantity >= product.inventory;

                            return (

                                <article
                                    key={item._id}
                                    className={styles.cartItem}
                                >

                                    {/* Product image */}

                                    <div
                                        className={styles.imageWrapper}
                                        onClick={() =>
                                            navigate(
                                                `/products/${product._id}`
                                            )
                                        }
                                    >

                                        <img
                                            src={product.images}
                                            alt={product.name_}
                                        />

                                    </div>


                                    {/* Product information */}

                                    <div className={styles.itemInfo}>

                                        <div className={styles.itemTop}>

                                            <div>

                                                <p className={styles.category}>
                                                    {product.category}
                                                </p>

                                                <h2>
                                                    {product.name_}
                                                </h2>

                                            </div>


                                            <div className={styles.itemPrice}>

                                                <span>
                                                    ₹{itemTotal.toLocaleString("en-IN")}
                                                </span>

                                                {item.quantity > 1 && (
                                                    <small>
                                                        ₹{product.price.toLocaleString("en-IN")} each
                                                    </small>
                                                )}

                                            </div>

                                        </div>


                                        {/* Selected options */}

                                        <div className={styles.options}>

                                            {item.selectedColor && (
                                                <span>
                                                    Color: {item.selectedColor}
                                                </span>
                                            )}

                                            {item.selectedSize && (
                                                <span>
                                                    Size: {item.selectedSize}
                                                </span>
                                            )}

                                        </div>


                                        {/* Stock */}

                                        <div
                                            className={
                                                isOutOfStock
                                                    ? styles.outOfStock
                                                    : styles.stock
                                            }
                                        >

                                            <span className={styles.stockDot}></span>

                                            {isOutOfStock
                                                ? "Out of stock"
                                                : product.inventory <= 3
                                                    ? `Only ${product.inventory} left`
                                                    : "In stock"
                                            }

                                        </div>


                                        {/* Actions */}

                                        <div className={styles.itemActions}>

                                            <div className={styles.quantityControl}>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>


                                                <span>
                                                    {item.quantity}
                                                </span>


                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={maxReached}
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>

                                            </div>


                                            <button
                                                className={styles.removeButton}
                                                onClick={() =>
                                                    removeFromCart(item._id)
                                                }
                                            >
                                                Remove
                                            </button>


                                            <button
                                                className={styles.saveButton}
                                                disabled
                                            >
                                                Save for later
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            );

                        })}


                        <button
                            className={styles.continueShopping}
                            onClick={() => navigate("/products")}
                        >
                            ← Continue Shopping
                        </button>

                    </section>


                    {/* RIGHT SIDE — ORDER SUMMARY */}

                    <aside className={styles.orderSummary}>

                        <h2>Order Summary</h2>

                        <div className={styles.summaryDivider}></div>


                        <div className={styles.summaryRow}>

                            <span>
                                Subtotal ({totalQuantity} items)
                            </span>

                            <strong>
                                ₹{subtotal.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2
                                })}
                            </strong>

                        </div>


                        <div className={styles.summaryRow}>

                            <span>Shipping</span>

                            <strong>Free</strong>

                        </div>


                        <div className={styles.summaryRow}>

                            <span>Estimated Tax</span>

                            <strong>
                                ₹{estimatedTax.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2
                                })}
                            </strong>

                        </div>


                        {/* Promo code */}

                        <div className={styles.promo}>

                            <input
                                type="text"
                                placeholder="Promo code"
                            />

                            <button>
                                Apply
                            </button>

                        </div>


                        <div className={styles.totalRow}>

                            <span>Total</span>

                            <strong>
                                ₹{total.toLocaleString("en-IN", {
                                    maximumFractionDigits: 2
                                })}
                            </strong>

                        </div>


                        <button
                            className={styles.checkoutButton}
                            onClick={() => {
                                // Checkout will be built next
                                console.log("Proceed to checkout");
                            }}
                        >
                            Proceed to Checkout
                        </button>


                        <div className={styles.securityInfo}>

                            <p>
                                <span>♢</span>
                                Secure checkout, encrypted payment
                            </p>

                            
                        </div>

                    </aside>

                </main>

            )}

        </div> 
    </>   
);    
} 


export default Cart;