import axios from 'axios';

const login = (email, password) => (dispatch) => {
    dispatch({type: 'USER_LOGIN_REQUEST'});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    axios.post('/api/users/login', {email, password}, config).then(user => {
        dispatch({type: 'USER_LOGIN_SUCCESS', payload: user.data});
        localStorage.setItem('userInfo', JSON.stringify(user.data));
    }).catch(err => {
        dispatch({
            type: 'USER_LOGIN_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({type: 'USER_LOGOUT'})
}

const register = (name, email, password) => (dispatch) => {
    dispatch({type: 'USER_REGISTER_REQUEST'});
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    axios.post('/api/users', {name, email, password}, config).then(user => {
        dispatch({type: 'USER_REGISTER_SUCCESS', payload: user.data});
        dispatch({type: 'USER_LOGIN_SUCCESS', payload: user.data});
        localStorage.setItem('userInfo', JSON.stringify(user.data));
    }).catch(err => {
        dispatch({
            type: 'USER_REGISTER_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

const getUserDetails = (id) => (dispatch, getState) => {
    dispatch({type: 'USER_DETAILS_REQUEST'});
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

    axios.get(`/api/users/${id}`, config).then(user => {
        dispatch({type: 'USER_DETAILS_SUCCESS', payload: user.data});
    }).catch(err => {
        dispatch({
            type: 'USER_DETAILS_FAILED', 
            payload: err.response && err.response.data.message ?
                err.response.data.message :
                err.message 
        });
    });
}

export {login, logout, register, getUserDetails}