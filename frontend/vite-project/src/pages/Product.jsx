import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.css";
import Navbar from "../components/Navbar/Navbar.jsx";

function Product() {

    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [wishlist, setWishlist] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);


    useEffect(() => {

        const getProduct = async () => {

            try {

                const response = await fetch(
                    `https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/products/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch product"
                    );
                }

                setProduct(data.product);

                if (data.product.colors?.length > 0) {
                    setSelectedColor(data.product.colors[0]);
                }

                if (data.product.sizes?.length > 0) {
                    setSelectedSize(data.product.sizes[0]);
                }

            } catch (err) {

                console.log(err.message);
                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        getProduct();

    }, [id]);

    useEffect(() => {

        const checkWishlist = async () => {

            try {

                const response = await fetch(
                    "https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/wishlist",
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to fetch wishlist"
                    );
                }

                const isWishlisted = data.wishlist.some(
                    (item) => String(item.productid) === String(id)
                );
                
                setWishlist(isWishlisted);

            } catch (err) {

                console.error(err);

            }
        };

        checkWishlist();

    }, [id]);

    const handleWishlist = async () => {

        try {

            const response = await fetch(
                `https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/wishlist/${id}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update wishlist"
                );
            }

            setWishlist(data.wishlisted);

        } catch (err) {

            console.error(err);

        }
    };

    const handleAddToCart = async () => {
    try {
        const response = await fetch(
            `https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/cart/${id}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    selectedColor,
                    selectedSize,
                    quantity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to add product to cart"
            );
        }

        setAddedToCart(true);

    } catch (err) {
        console.error(err.message);
    }
};

    if (loading) {
        return (
            <div className={styles.status}>
                Loading product...
            </div>
        );
    }


    if (error) {
        return (
            <div className={styles.status}>
                {error}
            </div>
        );
    }


    if (!product) {
        return (
            <div className={styles.status}>
                Product not found.
            </div>
        );
    }
    
    


    return (

        <div className={styles.page}>

            {/* Navigation */}
            <Navbar />

            {/* <nav className={styles.navbar}>

                <div className={styles.navLeft}>
                    <span>NEW</span>
                    <span>CLOTHING</span>
                    <span>BRANDS</span>
                    <span>ABOUT</span>
                </div>

                <div className={styles.logo}>
                    EKART
                </div>

                <div className={styles.navRight}>
                    <span>ACCOUNT</span>
                    <span>SEARCH</span>
                    <span>CART (0)</span>
                </div>

            </nav> */}


            {/* Product */}

            <main className={styles.productContainer}>

                {/* Image */}

                <section className={styles.imageSection}>

                    <div className={styles.imageWrapper}>

                        <img
                            src={product.images}
                            alt={product.name_}
                            className={styles.productImage}
                        />

                    </div>

                </section>


                {/* Product Information */}

                <section className={styles.infoSection}>

                    <p className={styles.category}>
                        {product.category}
                    </p>

                    <h1 className={styles.productName}>
                        {product.name_}
                    </h1>

                    <p className={styles.description}>
                        {product.description}
                    </p>


                    <div className={styles.price}>

                        ₹{product.price.toLocaleString("en-IN")}

                        {product.discount && (
                            <span className={styles.discount}>
                                {product.discount}% OFF
                            </span>
                        )}

                    </div>


                    {/* Colors */}

                    {product.colors?.length > 0 && (

                        <div className={styles.optionSection}>

                            <div className={styles.optionHeader}>
                                <span>COLOR</span>
                                <span>{selectedColor}</span>
                            </div>

                            <div className={styles.colorOptions}>

                                {product.colors.map((color) => (

                                    <button
                                        key={color}
                                        className={`${styles.colorButton} ${
                                            selectedColor === color
                                                ? styles.selectedColor
                                                : ""
                                        }`}
                                        style={{
                                            backgroundColor: color.toLowerCase()
                                        }}
                                        onClick={() =>
                                            setSelectedColor(color)
                                        }
                                        aria-label={`Select ${color}`}
                                    />

                                ))}

                            </div>

                        </div>

                    )}


                    {/* Sizes */}

                    {product.sizes?.length > 0 && (

                        <div className={styles.optionSection}>

                            <div className={styles.optionHeader}>
                                <span>SIZE</span>
                                <span>{selectedSize}</span>
                            </div>

                            <div className={styles.sizeOptions}>

                                {product.sizes.map((size) => (

                                    <button
                                        key={size}
                                        className={`${styles.sizeButton} ${
                                            selectedSize === size
                                                ? styles.selectedSize
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(size)
                                        }
                                    >
                                        {size}
                                    </button>

                                ))}

                            </div>

                        </div>

                    )}


                    {/* Actions */}

            <div className={styles.actions}>

                <div className={styles.quantityControl}>

                    <button
                        className={styles.quantityButton}
                        onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <span className={styles.quantity}>
                        {quantity}
                    </span>

                    <button
                        className={styles.quantityButton}
                        onClick={() =>
                            setQuantity((prev) => prev + 1)
                        }
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <button
                className={`${styles.addButton} ${
                    addedToCart ? styles.addedButton : ""
                }`}
                onClick={handleAddToCart}
            >
                {addedToCart ? "ADDED TO BAG" : "ADD TO SHOPPING BAG"}
            </button>


                <button
                    className={`${styles.wishlistButton} ${
                        wishlist ? styles.wishlisted : ""
                    }`}
                    onClick={handleWishlist}
                    aria-label="Add to wishlist"
                >
                    ♥
                </button>

            </div>

                     {/* Details */}

                    <div className={styles.details}>

                        <details>

                            <summary>
                                Product Details
                                <span>+</span>
                            </summary>

                            <p>
                                {product.description}
                            </p>

                        </details>


                        <details>

                            <summary>
                                Manufacturer
                                <span>+</span>
                            </summary>

                            <p>
                                {product.manufacturer}
                            </p>

                        </details>


                        <details>

                            <summary>
                                Delivery & Free Returns
                                <span>+</span>
                            </summary>

                            <p>
                                Easy delivery and free returns according
                                to our return policy.
                            </p>

                        </details>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Product;