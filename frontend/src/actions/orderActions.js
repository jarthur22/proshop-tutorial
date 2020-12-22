import axios from 'axios';

const createOrder = (order) => (dispatch, getState) => {
    dispatch({type: 'ORDER_CREATE_REQUEST'});
    const {userLogin} = getState();
    if(!userLogin.userInfo){
        /* dispatch({
            type: 'USER_DETAILS_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        }); */
        return;
    }
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userLogin.userInfo.token}`
        }
    }

    axios.post(`/api/orders`, order, config).then(res => {
        console.log(res.data);
        dispatch({type: 'ORDER_CREATE_SUCCESS', payload: res.data});
    }).catch(err => {
        dispatch({
            type: 'ORDER_CREATE_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

export {createOrder};