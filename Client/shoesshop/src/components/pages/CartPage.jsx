import React, { useState, useEffect } from "react"
import { CartItemService } from "../../services/cartService"
import { Link } from 'react-router-dom';
import { RatingStars } from "./RatingStars";
import { OrdersService } from "../../services/ordersService";

export default function CartPage(){
    const API_URL = process.env.REACT_APP_FILES_FOLDER
    const [cartItems, setCartItems] = useState([])
    const [totalPriceItems, setTotalPriceItems] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const [totalSelectedPrice, setTotalSelectedPrice] = useState(0)
    const [isButtonVisible, setIsButtonVisible] = useState(false)
    const [orderId, setOrderId] = useState(0)
    const [promo, setPromo] = useState("")
    
    const fetchCartItems = async () => {
        try {
            const response = await CartItemService.getCartItems()
            setCartItems(response.data)
        } catch (error) {
            window.location.href = '/404';
            //alert(`Error: ${error.message}`)
        }
    }

    useEffect(()=>{
        fetchCartItems()
    }, [])

    useEffect(()=> {
        setTotalPriceItems(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0))
        setTotalCount(cartItems.reduce((acc, item) => acc + item.quantity, 0))
        setTotalSelectedPrice(
            cartItems
                .filter(item => item.isChecked)
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
        )
       
    }, [cartItems])

    useEffect(()=> {
        const counter = document.getElementById("cart-items-count")
        counter.textContent = totalCount
    }, [totalCount])

    const updateQuantity = async (id, change) => {
        try {
            const itemToUpdate = cartItems.find(item => item.id === id)
            const newQuantity = Math.max(0, itemToUpdate.quantity + change)
            if (newQuantity === 0) {
                removeItem(id)
            } else {
                await CartItemService.updateCartItem({ id: id, quantity: newQuantity})
                setCartItems((prev) =>
                    prev.map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(0, item.quantity + change) }
                        : item
                ))
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    const removeItem = async (id) => {
        try {
            await CartItemService.deleteCartItem(id)
            setCartItems((prev) => prev.filter((item) => item.id !== id))
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleCheckboxChange = (itemId) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
            )
        )
    }

    const handleOrder = async () => {
        const selectedItems = cartItems.filter(item => item.isChecked)

        const data = {
            promoCode: promo,
            totalPrice: totalSelectedPrice,
            items: selectedItems.map(item => ({
                cartItemId: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            }))
        }

        try {
            const response = await OrdersService.createOrder(data)
            setCartItems(cartItems.filter(item => !item.isChecked))
            setOrderId(response.data.orderId)
            setIsButtonVisible(true)
            setPromo("")
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    const handleChange = (e) => {
        setPromo(e.target.value)
    }

    const updateShoeSize = async (id, e) => {
        try {
            setCartItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, shoeSize: e.target.value } : item
                )
            )
            await CartItemService.updateCartItem({ id: id, shoeSize: e.target.value})
        } catch (error) {
            alert(`Error: ${error.message}`)
        }       
    }

    return (
        <section className="h-100 h-custom">
            <div className="container py-2 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12">
                    <div className="card card-registration card-registration-2" style={{borderRadius: "15px", backgroundColor:"#212020", color: 'white' }}>
                    <div className="card-body p-0">
                        <div className="row g-0">
                        <div className="col-lg-8">
                            <div className="p-5">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                                <h1 className="fw-bold mb-0">Shopping Cart</h1>
                            </div>
                            <hr className="my-4" />

                            <div className="scrollable-panel cart-scroll" style={{ maxHeight: '64vh', overflowY: 'auto' }}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="row mt-3 mb-4 d-flex justify-content-between align-items-center">
                                        <div className="col-md-1 col-lg-1 col-xl-1">
                                            <input
                                                className="d-none"
                                                type="checkbox"
                                                id={`checkbox-${item.id}`}
                                                checked={item.isChecked || false}
                                                onChange={() => handleCheckboxChange(item.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`checkbox-${item.id}`}>
                                                <i className={`bi ${item.isChecked ? "bi-check-circle-fill text-success" : "bi-check-circle"}`} style={{ fontSize: '24px' }}></i>
                                            </label>
                                        </div>
                                        <div className="col-md-2 col-lg-2 col-xl-2"  style={{position: 'relative'}}>
                                            <img
                                                src={`${API_URL}/${item.photo}`}
                                                className="img-fluid rounded-3"
                                                alt={item.productName}
                                                style={{ borderRadius: "5px", border: item.isChecked ? "4px solid green" : "4px solid transparent"}}
                                                onClick={() => handleCheckboxChange(item.id)}
                                            />
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                            <h6 className="text-light font-weight-bold mb-0" style={{fontSize: '20px'}}>
                                                <Link to={`/productdetails/${item.productId}`} style={{ cursor: "pointer", fontSize: '22px', textDecoration: 'none', color: 'white'}}> {item.productName}</Link>
                                            </h6>
                                            <RatingStars rating={item.rating} />
                                            <p>
                                                Size:&nbsp;
                                                <input
                                                    type="number"
                                                    value={item.shoeSize}
                                                    style={{ width: '50px', backgroundColor: 'grey', color: 'white', fontWeight: 'bold', left: 15, bottom: 100}}
                                                    onChange={(e) => updateShoeSize(item.id, e)}
                                                    min={35}
                                                    max={47}
                                                />
                                            </p>
                                        </div>
                                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex mb-2">
                                            <button className="btn px-2 text-light" onClick={() => updateQuantity(item.id, -1)}>
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                style={{ width: '50px'}}
                                                readOnly
                                            />
                                            <button className="btn px-2 text-light" onClick={() => updateQuantity(item.id, 1)}>
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                            <h6 className="mt-1 mb-0">${item.price.toFixed(2)}</h6>
                                        </div>
                                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                            <button className="btn btn-danger" onClick={() => removeItem(item.id)}>
                                                <i className="bi bi-x"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-5">
                                <Link to={`/catalog`} className="btn btn-light mb-0">
                                    <i className="bi bi-arrow-left"></i>&nbsp;
                                    Back to catalog
                                </Link>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-4" style={{ backgroundColor:"#424040", color: 'white', borderRadius: '15px' }}>
                            <div className="p-5">
                            <h3 className="fw-bold mb-5 mt-2 pt-1">Summary</h3>
                            <hr className="my-4" />

                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-uppercase">items {totalCount}</h5>
                                <h5>${totalPriceItems.toFixed(2)}</h5>
                            </div>

                            <h5 className="text-uppercase mb-3">Shipping</h5>
                            <div className="mb-4 pb-2">
                                <select className="form-select">
                                    <option value="1">Standard-Delivery</option>
                                </select>
                            </div>

                            <h5 className="text-uppercase mb-3">Promo code</h5>
                            <div className="mb-5">
                                <div className="form-outline">
                                <input type="text" id="promo" placeholder="Enter your code..." value={promo} onChange={handleChange} className="form-control form-control-lg" />
                                </div>
                            </div>

                            <hr className="my-4" />

                            <div className="d-flex justify-content-between mb-2">
                                <h5 className="text-uppercase">Total price</h5>
                                <h5>${totalSelectedPrice}</h5>
                            </div>

                            {cartItems.filter(item => item.isChecked).length > 0 ? (
                                <>
                                    {cartItems.filter(item => item.isChecked).map((item) => (<div key={item.id}>x{item.quantity} {item.productName} - ${item.price * item.quantity}</div>))}
                                    <button type="button" className="btn btn-dark btn-block btn-lg mt-5" onClick={() => handleOrder()}>Order</button>
                                </>
                            ) : (
                                <div>No items selected</div>
                            )}
                                <br />
                                <Link to={`/orderdetails/${orderId}`} className={`btn btn-dark btn-block btn-lg mt-5 ${!isButtonVisible ? 'd-none' : ''}`}>
                                    Check your last order&nbsp;
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    )
}
