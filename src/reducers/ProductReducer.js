import {
    FETCH_PRODUCTS_START,
    FETCH_PRODUCTS_SUCCESS,
    FETCH_PRODUCTS_FAILURE,
} from '../actions/ProductActions';

const initialState = {
    products: null,
    loadingProducts: false,
    error: null,
};

const ProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCTS_START:
            return {
                ...state,
                loadingProducts: true,
            };
        case FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                loadingProducts: false,
                products: action.payload,
            };
        case FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                loadingProducts: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default ProductReducer;
