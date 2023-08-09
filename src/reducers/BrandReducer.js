import {
    FETCH_BRANDS_START,
    FETCH_BRANDS_SUCCESS,
    FETCH_BRANDS_FAILURE,
} from '../actions/BrandAction';

const initialState = {
    brands: null,
    loadingBrands: false,
    error: null,
};

const BrandReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BRANDS_START:
            return {
                ...state,
                loadingBrands: true,
            };
        case FETCH_BRANDS_SUCCESS:
            return {
                ...state,
                loadingBrands: false,
                brands: action.payload,
            };
        case FETCH_BRANDS_FAILURE:
            return {
                ...state,
                loadingBrands: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default BrandReducer;
