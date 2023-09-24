import {
    SET_IS_APP_LOADING,
    SET_TOKEN,
    SET_FIRST_TIME_USE,
    SET_USER_DATA,
    SET_LOCATION_DATA
} from "../actions/GeneralAction";

const initialState = {
    isAppLoading: true,
    token: '',
    isFirstTimeUse: true,
    userData: {},
    location: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_IS_APP_LOADING:
            return { ...state, isAppLoading: action.payload };
        case SET_TOKEN:
            return { ...state, token: action.payload };
        case SET_FIRST_TIME_USE:
            return { ...state, isFirstTimeUse: action.payload };
        case SET_USER_DATA:
            return { ...state, userData: action.payload };
        case SET_LOCATION_DATA:
            return { ...state, location: action.payload };
        default:
            return state;
    }
};