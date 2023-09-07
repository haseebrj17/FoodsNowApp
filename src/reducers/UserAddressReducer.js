import {
    FETCH_ADDRESS_START,
    FETCH_ADDRESS_SUCCESS,
    FETCH_ADDRESS_FAILURE,
    ADD_ADDRESS_START,
    ADD_ADDRESS_SUCCESS,
    ADD_ADDRESS_FAILURE,
    UPDATE_ADDRESS_START,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAILURE
} from "../actions/UserAddressAction";

const initialState = {
    addresses: null,
    loadingAddress: false,
    error: null,
};

const AddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADDRESS_START:
        case ADD_ADDRESS_START:
        case UPDATE_ADDRESS_START:
            return {
                ...state,
                loadingAddress: true,
                error: null,
            };

        case FETCH_ADDRESS_SUCCESS:
            return {
                ...state,
                loadingAddress: false,
                addresses: action.payload,
            };

        case ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                loadingAddress: false,
                addresses: state.addresses
                    ? [...state.addresses, action.payload]
                    : [action.payload],
            };

        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                loadingAddress: false,
                addresses: state.addresses.map(addr =>
                    addr.id === action.payload.id ? action.payload : addr
                ),
            };

        case FETCH_ADDRESS_FAILURE:
        case ADD_ADDRESS_FAILURE:
        case UPDATE_ADDRESS_FAILURE:
            return {
                ...state,
                loadingAddress: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default AddressReducer;
