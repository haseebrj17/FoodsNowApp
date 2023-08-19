// import { configureStore } from '@reduxjs/toolkit';
// import Reducers from './reducers';
// import thunk from 'redux-thunk';

// const Store = configureStore({
//     reducer: Reducers,
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
// });

// const getToken = () => Store?.getState()?.generalState?.token;
// const getLocation = () => Store?.getState()?.generalState?.location;

// export { Store, getToken, getLocation };

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import Reducers from './reducers';
import thunk from 'redux-thunk';

const Store = configureStore({
    reducer: Reducers,
    middleware: getDefaultMiddleware({
        immutableCheck: false,
    }).concat(thunk),
});

const getToken = () => Store?.getState()?.generalState?.token;
const getLocation = () => Store?.getState()?.generalState?.location;

export { Store, getToken, getLocation };