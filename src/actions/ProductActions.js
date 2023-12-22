import { RestaurantService } from "../services";

export const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const FETCH_PRODUCTSBYIDS_START = 'FETCH_PRODUCTSBYIDS_START';
export const FETCH_PRODUCTSBYIDS_SUCCESS = 'FETCH_PRODUCTSBYIDS_SUCCESS';
export const FETCH_PRODUCTSBYIDS_FAILURE = 'FETCH_PRODUCTSBYIDS_FAILURE';

export const fetchProductsByIdsStart = () => ({
    type: FETCH_PRODUCTSBYIDS_START,
});

export const fetchProductsByIdsSuccess = (products) => ({
    type: FETCH_PRODUCTSBYIDS_SUCCESS,
    payload: products,
});

export const fetchProductsByIdsFailure = (error) => ({
    type: FETCH_PRODUCTSBYIDS_FAILURE,
    payload: error,
});

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

export const fetchProducts = (categoryId) => {
    return async (dispatch) => {
        dispatch(fetchProductsStart());
        try {
            const response = await RestaurantService.getProducts({ categoryId });
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

export const fetchProductsByIds = (Ids) => {
    return async (dispatch) => {
        dispatch(fetchProductsByIdsStart());
        try {
            const response = await RestaurantService.getProductsByIds(Ids);
            if (response?.status) {
                dispatch(fetchProductsByIdsSuccess(response?.data));
            } else {
                dispatch(fetchProductsByIdsFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchProductsByIdsFailure(error.message));
        }
    };
};
