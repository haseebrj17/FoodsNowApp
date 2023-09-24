import { combineReducers } from 'redux';
import GeneralReducer from './GeneralReducer';
import CartReducer from './CartReducer';
import BrandReducer from './BrandReducer';
import ProductReducer from './ProductReducer';
import AddressReducer from './UserAddressReducer';

export default combineReducers({
    generalState: GeneralReducer,
    cartState: CartReducer,
    brandState: BrandReducer,
    productState: ProductReducer,
    addressState: AddressReducer
});