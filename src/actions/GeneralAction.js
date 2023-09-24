import { AuthenicationService, StorageService } from '../services';
import CartAction from './CartAction';


export const SET_IS_APP_LOADING = 'SET_IS_APP_LOADING';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_FIRST_TIME_USE = 'SET_FIRST_TIME_USE';
export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_LOCATION_DATA = 'SET_LOCATION_DATA';


export const setIsAppLoading = isAppLoading => {
    return {
        type: SET_IS_APP_LOADING,
        payload: isAppLoading,
    };
};

export const setToken = token => {
    return {
        type: SET_TOKEN,
        payload: token,
    };
};

export const setIsFirstTimeUse = () => {
    return {
        type: SET_FIRST_TIME_USE,
        payload: false,
    };
};

export const setLocation = location => {
    return {
        type: SET_LOCATION_DATA,
        payload: location,
    };
};

export const setUserData = userData => {
    return {
        type: SET_USER_DATA,
        payload: userData,
    };
};

export const appStart = () => {
    return async (dispatch, getState) => {
        try {
            const isFirstTimeUse = await StorageService.getFirstTimeUse();
            dispatch({
                type: SET_FIRST_TIME_USE,
                payload: isFirstTimeUse ? false : true,
            });

            const token = await StorageService.getToken();

            if (token) {
                dispatch({ type: SET_TOKEN, payload: token });

                const location = await StorageService.getLocation();
                dispatch({
                    type: SET_LOCATION_DATA,
                    payload: location || {},
                });

                const userDate = await StorageService.getUserData();
                dispatch({
                    type: SET_USER_DATA,
                    payload: userDate || {},
                })
            }
        } catch (error) {
            console.error("Error during app start:", error);
            // Consider dispatching an error action here if you have one
        } finally {
            dispatch({ type: SET_IS_APP_LOADING, payload: false });
        }
    };
};
