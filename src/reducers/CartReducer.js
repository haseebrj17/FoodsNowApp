import {
    GET_CART_ITEMS,
    SET_IS_LOADING,
    ADD_TO_CART_START,
    ADD_TO_CART_SUCCESS,
    ADD_TO_CART_FAILURE,
    SET_SUB_LOADING,
    UNSET_SUB_LOADING,
    BEGIN_DECREMENTING,
    END_DECREMENTING
} from '../actions/CartAction';

const initialState = {
    cart: [],
    isLoading: false,
    subLoading: false,
    isDecrementing: false,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_CART_ITEMS:
            return { ...state, cart: action?.payload };
        case SET_IS_LOADING:
        case ADD_TO_CART_START:
            return { ...state, isLoading: true, error: null };
        case ADD_TO_CART_SUCCESS:
            return { ...state, isLoading: false, error: null };
        case ADD_TO_CART_FAILURE:
            return { ...state, isLoading: false, error: action?.payload };
        case SET_SUB_LOADING:
            return { ...state, subLoading: true };
        case UNSET_SUB_LOADING:
            return { ...state, subLoading: false };
        case BEGIN_DECREMENTING:
            return { ...state, isDecrementing: true };
        case END_DECREMENTING:
            return { ...state, isDecrementing: false };
        default:
            return state;
    }
};