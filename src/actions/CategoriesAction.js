import { RestaurantService } from "../services";

export const FETCH_CATEGORIES_START = 'FETCH_CATEGORIES_START';
export const FETCH_CATEGORIES_SUCCESS = 'FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'FETCH_CATEGORIES_FAILURE';

export const fetchCategoriesStart = () => ({
    type: FETCH_CATEGORIES_START,
});

export const fetchCategoriesSuccess = (categories) => ({
    type: FETCH_CATEGORIES_SUCCESS,
    payload: categories,
});

export const fetchCategoriesFailure = (error) => ({
    type: FETCH_CATEGORIES_FAILURE,
    payload: error,
});

export const fetchCategories = (FranchiseId) => {
    return async (dispatch) => {
        dispatch(fetchCategoriesStart());
        try {
            const response = await RestaurantService.getCategories({ FranchiseId });
            if (response?.status) {
                dispatch(fetchCategoriesSuccess(response?.data));
            } else {
                dispatch(fetchCategoriesFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchCategoriesFailure(error.message));
        }
    };
};
