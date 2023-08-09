import { RestaurantService } from "../services";

export const FETCH_BRANDS_START = 'FETCH_BRANDS_START';
export const FETCH_BRANDS_SUCCESS = 'FETCH_BRANDS_SUCCESS';
export const FETCH_BRANDS_FAILURE = 'FETCH_BRANDS_FAILURE';

export const fetchBrandsStart = () => ({
    type: FETCH_BRANDS_START,
});

export const fetchBrandsSuccess = (products) => ({
    type: FETCH_BRANDS_SUCCESS,
    payload: products,
});

export const fetchBrandsFailure = (error) => ({
    type: FETCH_BRANDS_FAILURE,
    payload: error,
});

export const fetchBrands = (franchiseId) => {
    return async (dispatch) => {
        dispatch(fetchBrandsStart());
        try {
            const response = await RestaurantService.getDashboard({ franchiseId });
            if (response?.status) {
                dispatch(fetchBrandsSuccess(response?.data));
            } else {
                dispatch(fetchBrandsFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchBrandsFailure(error.message));
        }
    };
};
