import { combineReducers } from 'redux';
import GeneralReducer from './GeneralReducer';
import CartReducer from './CartReducer';
import BookmarkReducer from './BookmarkReducer';
import BrandReducer from './BrandReducer';
import ProductReducer from './ProductReducer';

export default combineReducers({
    generalState: GeneralReducer,
    cartState: CartReducer,
    bookmarkState: BookmarkReducer,
    brandState: BrandReducer,
    productState: ProductReducer,
});