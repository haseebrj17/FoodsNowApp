import { RestaurantService } from "../services";

export const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const fetchProductsStart = () => ({
    type: FETCH_PRODUCTS_START,
});

export const fetchProductsSuccess = (products) => ({
    type: FETCH_PRODUCTS_SUCCESS,
    payload: products,
});

export const fetchProductsFailure = (error) => ({
    type: FETCH_PRODUCTS_FAILURE,
    payload: error,
});

export const fetchProducts = (categoryId, addSides) => {
    return async (dispatch) => {
        dispatch(fetchProductsStart());
        try {
            const response = await RestaurantService.getProducts({ categoryId, addSides });
            if (response?.status) {
                dispatch(fetchProductsSuccess(response?.data));
            } else {
                dispatch(fetchProductsFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchProductsFailure(error.message));
        }
    };
};
