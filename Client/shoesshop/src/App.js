import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import SignUp from "./components/pages/accounts/SignUp";
import SignIn from "./components/pages/accounts/SignIn";
import CartPage from "./components/pages/CartPage";
import About from "./components/pages/About";
import Profile from "./components/pages/accounts/Profile";
import Contacts from "./components/pages/Contacts";
import Home from "./components/pages/Home";
import AdminPage from "./components/pages/AdminPage";
import Catalog from "./components/pages/Catalog";
import NotFound from "./components/pages/NotFound";
import OrderDetails from "./components/pages/OrderDetails";
import ProductDetails from "./components/pages/ProductDetails";
import EmailConfirm from "./components/pages/accounts/EmailConfirm";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <Router>
      <Header />
      <section className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/orderdetails/:id" element={<OrderDetails />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/emailconfirm" element={<EmailConfirm />} />
        </Routes>
      </section>
      <Footer />
    </Router>
  );
}
