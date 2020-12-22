const orderCreateReducer = (state = {}, action) => {
    switch(action.type){
        case 'ORDER_CREATE-REQUEST':
            return {loading: true};
        case 'ORDER_CREATE_SUCCESS':
            return {loading: false, success: true, order: action.payload};
        case 'ORDER_CREATE_FAILED':
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}
export {orderCreateReducer};