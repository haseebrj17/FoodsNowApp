import { UserAddressService } from "../services";

export const FETCH_ADDRESS_START = 'FETCH_ADDRESS_START';
export const FETCH_ADDRESS_SUCCESS = 'FETCH_ADDRESS_SUCCESS';
export const FETCH_ADDRESS_FAILURE = 'FETCH_ADDRESS_FAILURE';

export const ADD_ADDRESS_START = 'ADD_ADDRESS_START';
export const ADD_ADDRESS_SUCCESS = 'ADD_ADDRESS_SUCCESS';
export const ADD_ADDRESS_FAILURE = 'ADD_ADDRESS_FAILURE';

export const UPDATE_ADDRESS_START = 'UPDATE_ADDRESS_START';
export const UPDATE_ADDRESS_SUCCESS = 'UPDATE_ADDRESS_SUCCESS';
export const UPDATE_ADDRESS_FAILURE = 'UPDATE_ADDRESS_FAILURE';

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

export const addAddressStart = () => ({
    type: ADD_ADDRESS_START
});

export const addAddressSuccess = (address) => ({
    type: ADD_ADDRESS_SUCCESS,
    payload: address,
});

export const addAddressFailure = (error) => ({
    type: ADD_ADDRESS_FAILURE,
    payload: error,
});

export const updateAddressStart = () => ({
    type: UPDATE_ADDRESS_START
});

export const updateAddressSuccess = (address) => ({
    type: UPDATE_ADDRESS_SUCCESS,
    payload: address,
});

export const updateAddressFailure = (error) => ({
    type: UPDATE_ADDRESS_FAILURE,
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

export const addUserAddressAction = (userId, address) => {
    return async (dispatch) => {
        dispatch(addAddressStart());
        try {
            const response = await UserAddressService.addUserAddress({ userId, address });
            if (response?.status) {
                dispatch(addAddressSuccess(response?.data));
            } else {
                dispatch(addAddressFailure(response.message));
            }
        } catch (error) {
            dispatch(addAddressFailure(error.message));
        }
    };
};

export const updateUserAddressAction = (userId, address) => {
    return async (dispatch) => {
        dispatch(updateAddressStart());
        try {
            const response = await UserAddressService.updateUserAddress({ userId, address });
            if (response?.status) {
                dispatch(updateAddressSuccess(response?.data));
            } else {
                dispatch(updateAddressFailure(response.message));
            }
        } catch (error) {
            dispatch(updateAddressFailure(error.message));
        }
    };
};

