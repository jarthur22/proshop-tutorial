import React, {useState, useEffect} from 'react';
import {Button, Row, Col, ListGroup, Image, Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import {createOrder} from '../actions/orderActions';

const PlaceOrderScreen = ({history}) => {
    const [itemsPrice, setItemsPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [taxPrice, setTaxPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const {
        shippingAddress, 
        paymentMethod, 
        cartItems
    } = cart;

    const orderCreate = useSelector(state => state.orderCreate);
    const {order, success, error} = orderCreate;

    useEffect(() => {
        if(cartItems && cartItems.length > 0){
            setItemsPrice(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            setShippingPrice(addDecimals(+itemsPrice > 100 ? 0.00 : 10));
            setTaxPrice(addDecimals(+(0.15 * +itemsPrice).toFixed(2)));
            setTotalPrice(addDecimals(+itemsPrice + +shippingPrice + +taxPrice))
        }
    }, [cartItems, itemsPrice, shippingPrice, taxPrice])

    useEffect(() => {
        if(success && order && order._id){
            history.push(`/order/${order._id}`)
        }
    }, [success, order, history])

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
    }

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        }));
    }

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {shippingAddress && `${shippingAddress.address}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {paymentMethod && paymentMethod}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {!cartItems || cartItems.length === 0 ? 
                            <Message>Your cart is empty.</Message>: (
                                <ListGroup variant='flush'>
                                    {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = {item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${itemsPrice && itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${shippingPrice && shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${taxPrice && taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${totalPrice && totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cartItems === 0}
                                    onClick={placeOrderHandler}
                                >Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default PlaceOrderScreen
