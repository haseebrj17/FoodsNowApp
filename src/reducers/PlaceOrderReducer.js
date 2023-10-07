import {
    PLACE_ORDER_START,
    PLACE_ORDER_SUCCESS,
    PLACE_ORDER_FAILURE
} from '../actions/PlaceOrderAction'

const initialState = {
    order: null,
    loading: false,
    error: null
};

const PlaceOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case PLACE_ORDER_START:
            return {
                ...state,
                loading: true,
                error: null
            };

        case PLACE_ORDER_SUCCESS:
            return {
                ...state,
                order: action.payload,
                loading: false,
                error: null
            };

        case PLACE_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};

export default PlaceOrderReducer;
