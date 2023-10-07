import { 
    FETCH_ORDER_START,
    FETCH_ORDER_SUCCESS,
    FETCH_ORDER_FAILURE
} from '../actions/GetOrderAction'

const initialState = {
    order: null,
    loadingOrder: false,
    error: null,
};

const GetOrderReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ORDER_START:
            return {
                ...state,
                loadingOrder: true,
            };
        case FETCH_ORDER_SUCCESS:
            return {
                ...state,
                loadingOrder: false,
                order: action.payload,
            };
        case FETCH_ORDER_FAILURE:
            return {
                ...state,
                loadingOrder: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default GetOrderReducer;
