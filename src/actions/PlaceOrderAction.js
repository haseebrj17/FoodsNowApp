import { OrderService } from "../services";

export const PLACE_ORDER_START = 'PLACE_ORDER_START';
export const PLACE_ORDER_SUCCESS = 'PLACE_ORDER_SUCCESS';
export const PLACE_ORDER_FAILURE = 'PLACE_ORDER_FAILURE';

export const placeOrderStart = () => ({
    type: PLACE_ORDER_START
});

export const placeOrderSuccess = (orderDetails) => ({
    type: PLACE_ORDER_SUCCESS,
    payload: orderDetails,
});

export const placeOrderFailure = (error) => ({
    type: PLACE_ORDER_FAILURE,
    payload: error,
});

export const placeOrder = (inputs, token) => {
    return async (dispatch) => {
        dispatch(placeOrderStart());
        try {
            const response = await OrderService.placeOrder(inputs, token);
            if (response?.status) {
                dispatch(placeOrderSuccess(response?.data));
                return { status: true, message: "Order placed successfully" };
            } else {
                dispatch(placeOrderFailure(response.message));
                return { status: false, message: response.message };
            }
        } catch (error) {
            console.error('Order action error:', error);
            dispatch(placeOrderFailure(error.message || 'Unexpected Error while placing order'));
            return { status: false, message: error.message || 'Unexpected Error while placing order' };
        }
    };
};
