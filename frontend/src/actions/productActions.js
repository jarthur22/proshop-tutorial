import axios from 'axios';

const listProducts = () => (dispatch) => {
    dispatch({type: 'PRODUCT_LIST_REQUEST'});
    axios.get('/api/products').then(res => {
        dispatch(({type: 'PRODUCT_LIST_SUCCESS', payload: res.data}));
    }).catch(err => {
        dispatch({
            type: 'PRODUCT_LIST_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

const listProductDetails = (id) => (dispatch) => {
    dispatch({type: 'PRODUCT_DETAILS_REQUEST'});
    axios.get(`/api/products/${id}`).then(res => {
        dispatch(({type: 'PRODUCT_DETAILS_SUCCESS', payload: res.data}));
    }).catch(err => {
        console.log(err.message);
        dispatch({
            type: 'PRODUCT_DETAILS_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

export {listProducts, listProductDetails};