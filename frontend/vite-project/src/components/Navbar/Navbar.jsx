import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const [showFilters, setShowFilters] = useState(false);

    // SEARCH STATE
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");
    const [cartCount, setCartCount] = useState(0);

    const categories = [
        "T-Shirts",
        "Footwear",
        "Bags",
        "Jeans",
        "Watches",
        "Stationery"
    ];

    const handleCategoryClick = (category) => {

        if (category === "All Products") {
            navigate("/products");
        } else {
            navigate(`/products?category=${encodeURIComponent(category)}`);
        }

        setShowFilters(false);
    };


    // SEARCH HANDLER
    const handleSearch = (e) => {

        if (e.key === "Enter") {

            const trimmedSearch = search.trim();

            if (!trimmedSearch) {
                return;
            }

            navigate(
                `/products?search=${encodeURIComponent(trimmedSearch)}`
            );

            setShowSearch(false);
        }
    };
    useEffect(() => {
    const getCartCount = async () => {
        try {
            const response = await fetch(
                "https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/cart",
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

            const totalQuantity = data.cart.reduce(
                (total, item) => total + item.quantity,
                0
            );

            setCartCount(totalQuantity);

        } catch (err) {
            console.error("Cart count error:", err);
        }
    };

    getCartCount();
}, []);


    return (
        <nav className={styles.navbar}>

            {/* LOGO */}
            <div className={styles.logo}>
                EKART
            </div>


            {/* NAVIGATION ICONS */}
            <div className={styles.navIcons}>

                {/* FILTER */}
                <div className={styles.filterWrapper}>

                    <button
                        className={styles.iconButton}
                        aria-label="Filter"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <line x1="4" y1="6" x2="20" y2="6" />
                            <line x1="7" y1="12" x2="17" y2="12" />
                            <line x1="10" y1="18" x2="14" y2="18" />
                        </svg>
                    </button>


                    {/* FILTER MENU */}
                    {showFilters && (
                        <div className={styles.filterMenu}>

                            <button
                                className={styles.filterOption}
                                onClick={() =>
                                    handleCategoryClick("All Products")
                                }
                            >
                                All Products
                            </button>

                            {categories.map((category) => (

                                <button
                                    key={category}
                                    className={styles.filterOption}
                                    onClick={() =>
                                        handleCategoryClick(category)
                                    }
                                >
                                    {category}
                                </button>

                            ))}

                        </div>
                    )}

                </div>


                {/* SEARCH */}
                <div className={styles.searchWrapper}>

                    {showSearch && (
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    )}

                    <button
                        className={styles.iconButton}
                        aria-label="Search"
                        onClick={() => setShowSearch(!showSearch)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="6.5"
                            />

                            <line
                                x1="16"
                                y1="16"
                                x2="21"
                                y2="21"
                            />
                        </svg>
                    </button>

                </div>


                {/* ACCOUNT */}
                <button
                    className={styles.iconButton}
                    aria-label="Account"
                    onClick={() => navigate("/account")}
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="8"
                            r="3.2"
                        />

                        <path
                            d="M5.5 20c.7-3.5 3-5.3 6.5-5.3s5.8 1.8 6.5 5.3"
                        />
                    </svg>
                </button>


                {/* WISHLIST */}
                <button
                    className={styles.iconButton}
                    aria-label="Wishlist"
                    onClick={() => navigate("/wishlist")}
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 20.5S4 15.2 4 9.3C4 6.6 5.8 5 8.1 5c1.5 0 3 .8 3.9 2.1C12.9 5.8 14.4 5 15.9 5 18.2 5 20 6.6 20 9.3c0 5.9-8 11.2-8 11.2z"
                        />
                    </svg>
                </button>


                {/* CART */}
                <button
                    className={styles.iconButton}
                    aria-label="Shopping cart"
                    onClick={() => navigate("/cart")}
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 5h2l1.5 10h10L20 8H7"
                        />

                        <circle
                            cx="10"
                            cy="19"
                            r="1.3"
                        />

                        <circle
                            cx="17"
                            cy="19"
                            r="1.3"
                        />
                    </svg>

                    <span className={styles.cartCount}>
                        {cartCount}
                    </span>
                </button>

            </div>

        </nav>
    );
}

export default Navbar;