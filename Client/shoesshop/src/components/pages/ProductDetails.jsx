import { useParams } from 'react-router-dom'
import { ProductsService } from '../../services/productsService'
import { useEffect, useState, useCallback } from 'react'
import { CartItemService } from '../../services/cartService'
import { RatingStars } from './RatingStars'
import Review from './Review'

export default function ProductDetails() {
    const { id } = useParams()
    const API_URL = process.env.REACT_APP_FILES_FOLDER
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState(35)

    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, parseInt(e.target.value) || 1)
        setQuantity(newQuantity)
    }
    
    const fetchProduct =  useCallback(async () => {
        setLoading(true)
        try {
            const response = await ProductsService.getProductById(id)
            if (response.data !== null) {
                setProduct(response.data)
                setLoading(false)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }, [id])

    useEffect(()=>{
        fetchProduct()
    }, [fetchProduct])

    const handleAddToCart= async () => {
        try {
          await CartItemService.createCartItem({ productId: id, quantity: quantity, price: product.price, shoeSize: selectedSize.toString() })
          const counter = document.getElementById("cart-items-count")
          counter.textContent =  parseInt(counter.textContent) + quantity
        } catch (error) {
          alert(error.message)
        }
    }

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    }

    return (
        <>
        {loading ? (
           <div className="loader"></div>
          ) : (
            <>
                <div className="container mt-5">
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <img
                                    src={`${API_URL}/${product.photo}`}
                                    alt="Product"
                                    className="img-fluid rounded mb-3 product-image"
                                />
                            </div>

                            <div className="col-md-6">
                            <h2 className="mb-3">{product.productName}</h2>
                            <p className="text-muted mb-4">SKU: {product.id}</p>
                            <div className="mb-3">
                                <span className="h4 me-2">${product.price}</span>
                            </div>
                            <RatingStars rating={product.rating} />
                            <p className="mb-4">{product.description}</p>
                            <div className="mb-4">
                                <label htmlFor="quantity" className="form-label">Quantity:</label>
                                <input type="number" className="form-control" id="quantity" value={quantity} onChange={handleQuantityChange} min="1" style={{ width: '80px' }} />
                            </div>
                            
                            <h5>Size</h5>
                            <div className="d-flex flex-wrap gap-2">
                                {Array.from({ length: 13 }, (_, index) => 35 + index).map((size) => (
                                <button
                                    key={size}
                                    className={`btn btn-outline-dark ${selectedSize === size ? 'active' : ''}`}
                                    onClick={() => handleSizeClick(size)}
                                >
                                    {size}
                                </button>
                                ))}
                            </div>
                            
                            <button className="btn btn-primary btn-lg mt-5 mb-3 me-2" onClick={handleAddToCart}>
                                <i className="bi bi-cart-plus"></i> Add to Cart
                            </button>
                            <div className="mt-4">
                                <h5>Key Features:</h5>
                                <ul>
                                    <li>Breathable mesh upper for maximum comfort</li>
                                    <li>Durable rubber sole for enhanced traction</li>
                                    <li>Shock-absorbing midsole for added support</li>
                                    <li>Flexible design for optimal foot movement</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Review productId={id}/>
                </div>
            </>
            )}
        </>
    )
}
