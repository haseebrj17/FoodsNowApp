// import { configureStore } from '@reduxjs/toolkit';
// import logger from 'redux-logger'
// import {
//     persistStore,
//     persistCombineReducers,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER
// } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import reducers from './reducers';

// const config = {
//     key: 'root',
//     storage: AsyncStorage,
//     debug: true
// }

// export const Store = configureStore({
//     reducer: persistCombineReducers(config, {
//         campsites: campsitesReducer,
//         comments: commentsReducer,
//         partners: partnersReducer,
//         promotions: promotionsReducer,
//         favorites: favouritesReducer
//     }),
//     middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//         serializableCheck: {
//             ignoredActions: [
//                 FLUSH,
//                 REHYDRATE,
//                 PAUSE,
//                 PERSIST,
//                 PURGE,
//                 REGISTER
//             ]
//         }
//     })
// });

// export const persistor = persistStore(Store);

// import { configureStore } from "@reduxjs/toolkit";
// import reducers from "./reducers";

// export const Store = configureStore({reducer: reducers})

// import {createStore, applyMiddleware} from 'redux';
// import Reducers from './reducers';
// import thunk from 'redux-thunk';

// const Store = createStore(Reducers, applyMiddleware(thunk));

// const getToken = () => Store?.getState()?.generalState?.token;
// const getLocation = () => Store?.getState()?.generalState?.location;

// export {Store, getToken};

import { configureStore } from '@reduxjs/toolkit';
import Reducers from './reducers';
import thunk from 'redux-thunk';

const Store = configureStore({
    reducer: Reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

const getToken = () => Store?.getState()?.generalState?.token;
const getLocation = () => Store?.getState()?.generalState?.location;

export { Store, getToken, getLocation };