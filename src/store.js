import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import Reducers from './reducers';
import thunk from 'redux-thunk';
import cartRefetchMiddleware from './middleware/cartRefetchMiddleware';
import { subLoadingMiddleware } from './middleware/subLoadingMiddleware';

const Store = configureStore({
    reducer: Reducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
        .concat(cartRefetchMiddleware, subLoadingMiddleware)
});

const getToken = () => Store?.getState()?.generalState?.token;

export { Store, getToken };