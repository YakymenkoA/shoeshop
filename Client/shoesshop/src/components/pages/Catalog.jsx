import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { ProductsService } from "../../services/productsService";
import { RatingStars } from './RatingStars';
import { CartItemService } from "../../services/cartService";

export default function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.REACT_APP_FILES_FOLDER

  const loadProducts = async () => {
      try {
        const response = await ProductsService.getAll()
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error(error)
      }
  }
  
  useEffect(() => {
  loadProducts();
  }, [])

  const handleAddToCart= async (id, quantity, price) => {
    try {
      await CartItemService.createCartItem({productId: id, quantity: quantity, price: price, shoeSize: "35"})
      const counter = document.getElementById("cart-items-count")
      counter.textContent =  parseInt(counter.textContent) + quantity
    } catch (error) {
      alert(error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  return <>
   <div className="products-grid">
      {products.map((product) => (
        <div className="products-container" key={product.id}>
          <div className="product-cart">
            <img
                src={`${API_URL}/${product.photo}`}
                alt={product.productName}
            />
            <h4 className="product-title">{product.productName}</h4>
            <i className="fas fa-expand">{product.brandName}</i>
            <i className="fas fa-expand">{product.categoryName}</i>
            <RatingStars rating={product.rating} />
            <h4 className="product-price">${product.price}</h4>
          </div>
          <div className="buttons-container">
            <Link to={`/productdetails/${product.id}`} className="btn-details">
              Details
            </Link>
            <button
              className="btn-add-to-cart"
              onClick={() => handleAddToCart(product.id, 1, product.price)}
            >
              <i className="bi bi-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </>
}
