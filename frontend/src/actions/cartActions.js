import axios from 'axios';

const addToCart = (id, qty) => (dispatch, getState) => {
    axios.get(`/api/products/${id}`).then(res => {
        dispatch({type: 'CART_ADD_ITEM', payload: {
            product: res.data._id,
            name: res.data.name,
            image: res.data.image,
            price: res.data.price,
            countInStock: res.data.countInStock,
            qty
        }});
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    })
}

const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({type: "CART_REMOVE_ITEM", payload: id});

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
}

export {addToCart, removeFromCart};