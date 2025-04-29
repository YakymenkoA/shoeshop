import { useParams } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { OrdersService } from '../../services/ordersService'
import { Link } from 'react-router-dom'
import { RatingStars } from './RatingStars'

export default function OrderDetails() {
    const { id } = useParams()
    const API_URL = process.env.REACT_APP_FILES_FOLDER
    const [order, setOrder] = useState(null)
    
    const fetchOrder = useCallback(async () => {
        try {
            const response = await OrdersService.getOrderById(id)
            if (response.data !== null) {
                setOrder(response.data)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }, [id])

    useEffect(()=>{
        fetchOrder()
    }, [fetchOrder])

    return (
        <div>
            {order ? (
                <>
                <h3>Order <strong>#</strong>{order.id}</h3>
                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',  hour12: false})}</p>
                <p><strong>Status:</strong>&nbsp;
                    <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 
                                            order.status === 'Cancelled' ? 'bg-danger' : 
                                            order.status === 'Shipped' ? 'bg-info' : 
                                            order.status === 'Processing' ? 'bg-primary' : ''}`}
                    >
                        {order.status}
                    </span>
                </p>
                <p><strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}</p>          
                <h3>Products</h3>
                <div className="table-responsive scrollable-panel" style={{maxHeight: '60vh'}}>
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark" style={{position: "sticky", top: "0", height: '4rem', border: 'none'}}>
                        <tr>
                            <th>Photo</th>
                            <th>Product Name</th>
                            <th>Rating</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Total Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.orderItems.map((product, index) => (
                            <tr key={index}>
                            <td><img src={`${API_URL}/${product.photo}`} alt={product.productName} style={{ width: '100px', height: '100px' }} /></td>
                            <td><Link to={`/productdetails/${product.productId}`} className="text-dark black-underline" style={{ cursor: "pointer" }}>{product.productName}</Link></td>
                            <td><RatingStars rating={product.rating} /></td>
                            <td>{product.brandName}</td>
                            <td>{product.categoryName}</td>
                            <td>{product.description}</td>
                            <td>{product.quantity}</td>
                            <td>{product.shoeSize}</td>
                            <td>${product.price}</td>
                            <td>${product.price * product.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
            ) : (
                <p>No order data available.</p>
            )}
    </div>
    )
}
