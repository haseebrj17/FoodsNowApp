import { GetOrderService } from "../services";

export const FETCH_ORDER_START = 'FETCH_ORDER_START';
export const FETCH_ORDER_SUCCESS = 'FETCH_ORDER_SUCCESS';
export const FETCH_ORDER_FAILURE = 'FETCH_ORDER_FAILURE';

export const fetchOrderStart = () => ({
    type: FETCH_ORDER_START,
});

export const fetchOrderSuccess = (order) => ({
    type: FETCH_ORDER_SUCCESS,
    payload: order,
});

export const fetchOrderFailure = (error) => ({
    type: FETCH_ORDER_FAILURE,
    payload: error,
});

export const fetchOrders = (token) => {
    return async (dispatch) => {
        dispatch(fetchOrderStart());
        try {
            const response = await GetOrderService.getUserOrder(token);
            if (response?.status) {
                dispatch(fetchOrderSuccess(response?.data));
            } else {
                dispatch(fetchOrderFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchOrderFailure(error.message));
        }
    };
};
