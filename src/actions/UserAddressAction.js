import { UserAddressService } from "../services";

export const FETCH_ADDRESS_START = 'FETCH_ADDRESS_START';
export const FETCH_ADDRESS_SUCCESS = 'FETCH_ADDRESS_SUCCESS';
export const FETCH_ADDRESS_FAILURE = 'FETCH_ADDRESS_FAILURE';

export const fetchAddressStart = () => ({
    type: FETCH_ADDRESS_START
});

export const fetchAddressSuccess = (products) => ({
    type: FETCH_ADDRESS_SUCCESS,
    payload: products,
});

export const fetchAddressFailure = (error) => ({
    type: FETCH_ADDRESS_FAILURE,
    payload: error,
});

export const fetchAddresses = (userId) => {
    return async (dispatch) => {
        dispatch(fetchAddressStart());
        try {
            const response = await UserAddressService.getUserAddress({ userId });
            if (response?.status) {
                dispatch(fetchAddressSuccess(response?.data));
            } else {
                dispatch(fetchAddressFailure(response.message));
            }
        } catch (error) {
            dispatch(fetchAddressFailure(error.message));
        }
    };
};
