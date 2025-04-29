import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrdersService } from '../../../services/ordersService';

export default function Orders() {
    const [orders, setOrders] = useState([])
    const API_URL = process.env.REACT_APP_FILES_FOLDER

    const fetchOrders = async () => {
        try {
            const response = await OrdersService.getAllUserOrders()
            if (response.data !== null) {
                setOrders(response.data)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        }
    }

    useEffect(()=>{
        fetchOrders()
    },[])

    return (
        <div className="scrollable-panel" style={{ maxHeight: '77vh', overflowY: 'auto' }}>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={index} className="card mb-4 history-card">
                        <div className="card-body"> 
                            <div className="row align-items-center text-center">
                                <div className="col-md-3">
                                    <h5 className="mb-2" style={{fontSize: '1.6rem'}}>Order #{order.id}</h5>
                                    <p>{new Date(order.orderDate).toLocaleString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',  hour12: false})}</p>
                                    <p className="mb-1">Status:&nbsp;
                                        <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 
                                                                  order.status === 'Cancelled' ? 'bg-danger' : 
                                                                  order.status === 'Shipped' ? 'bg-info' : 
                                                                 order.status === 'Processing' ? 'bg-primary' : ''}`
                                        }>
                                            {order.status}
                                        </span>
                                     </p>
                                </div>
                                <div className="col-md-7 text-center">
                                    {order.photos && order.photos.length > 0 ? (
                                            <div className="d-flex flex-md-row flex-column overflow-auto order-scroll" style={{ paddingBottom: "10px"}}>
                                                {order.photos.map((photo, index) => (
                                                    <div key={index} className="me-2 flex-shrink-0">
                                                        <img 
                                                            src={`${API_URL}/${photo}`} 
                                                            alt="-" 
                                                            className="img-fluid history-card-picture" 
                                                            style={{ width: "120px", height: "120px", objectFit: "cover", minWidth: "120px" }} 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p>No items in this order</p>
                                    )}
                                </div>
                                <div className="col-md-2 text-center">
                                    <h5 className="mb-0" style={{fontSize: '1.4rem'}}>{order.totalPrice.toFixed(2)} $</h5>
                                    <Link to={`/orderdetails/${order.id}`} className="btn btn-sm btn-light mt-3">
                                        Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                ) : (
                    <>
                        <div className='text-center'>
                            <h4 className="mt-5" style={{fontSize: '3rem', fontWeight:'500'}}>You have no orders yet.</h4>
                            <Link to={'/catalog'}><button className="btn btn-dark" style={{width: '200px', height: '50px', marginTop: '50px'}}>BUY NOW</button></Link>
                        </div>
                    </>
                )}
        </div>
     )
}
