import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Product from "./pages/Product.jsx";
import Landing from "./pages/LandingPage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import Cart from "./pages/Cart.jsx";
import "./App.css";

function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkAuthentication = async () => {
            try {

                const response = await fetch(
                    "https://scaling-goldfish-7rvj4rvrxg42wq9r-8084.app.github.dev/user/me",
                    {
                        credentials: "include" //what it does??
                    }
                );

                // if (response.status === 200) {
                //     const data = await response.json();
                //     setUser(data.user);
                // }

                // console.log("ME STATUS:", response.status);
                // console.log("ME RESPONSE:", data);
                
                
                if (response.status === 200) {
                    const data = await response.json();
                    setUser(data.user);
                }

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();

    }, []);

    // Wait until we know whether the user is authenticated
   if (loading) {
      return <div className="loading-screen">Loading...</div>;
   }

//    console.log("FINAL USER:", user);
//    console.log("FINAL LOADING:", loading);

    return (
        <BrowserRouter>
            <div className="app-container">

                <Routes>

                    {/* Landing page - only authenticated users */}
                    <Route
                        path="/"
                        element={
                            user
                                ? <Landing />
                                : <Navigate to="/user/login" replace />
                        }
                    />

                    {/* Login */}
                    <Route
                        path="/user/login"
                        element={
                            user
                                ? <Navigate to="/" replace />
                                : <Login setUser={setUser} />
                        }
                    />

                    {/* Register */}
                    <Route
                        path="/user/register"
                        element={<Register />}
                    />

                    {/* Product */}
                    <Route
                        path="/products/:id"
                        element={<Product />}
                    />
                    <Route
                        path="/account"
                        element={<AccountPage setUser={setUser} />}
                    />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<Product />} />
                    <Route
                        path="/products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="/products/:id"
                        element={<Product />}
                    />
                        
                    <Route
                        path="/products"
                        element={<ProductsPage />}
                    />

                    <Route
                        path="/products/:id"
                        element={<Product />}
                    />
                    <Route
                        path="/wishlist"
                        element={<WishlistPage />}
                    />
                    <Route path="/cart" element={<Cart />} />

                </Routes>

            </div>
        </BrowserRouter>
    );
}

export default App;