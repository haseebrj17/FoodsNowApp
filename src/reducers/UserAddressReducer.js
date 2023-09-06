import { 
    FETCH_ADDRESS_START,
    FETCH_ADDRESS_SUCCESS,
    FETCH_ADDRESS_FAILURE
} from "../actions/UserAddressAction";

const initialState = {
    addresses: null,
    loadingAddress: false,
    error: null,
};

const AddressReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADDRESS_START:
            return {
                ...state,
                loadingAddress: true,
            };
        case FETCH_ADDRESS_SUCCESS:
            return {
                ...state,
                loadingAddress: false,
                addresses: action.payload,
            };
        case FETCH_ADDRESS_FAILURE:
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
