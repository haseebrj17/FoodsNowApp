// import { CartService } from '../services';

// const types = {
//     GET_CART_ITEMS: 'GET_CART_ITEMS',
//     SET_IS_LOADING: 'SET_IS_LOADING',
// };

// const addToCart = ({ foodId }) => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         CartService.addToCart({ foodId })
//             .then(cartResponse => {
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartResponse?.data,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(() => {
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// const removeFromCart = ({ foodId }) => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         CartService.removeFromCart({ foodId })
//             .then(cartResponse => {
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartResponse?.data,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(() => {
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// const getCartItems = () => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         CartService.getCartItems()
//             .then(cartResponse => {
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartResponse?.data,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(() => {
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// export default { types, addToCart, removeFromCart, getCartItems };


// import Realm from 'realm';

// const CartSchema = {
//     name: 'Cart',
//     primaryKey: 'foodId',
//     properties: {
//         foodId: 'string',
//     },
// };

// const types = {
//     GET_CART_ITEMS: 'GET_CART_ITEMS',
//     SET_IS_LOADING: 'SET_IS_LOADING',
// };

// const addToCart = ({ foodId }) => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         Realm.open({ schema: [CartSchema] })
//             .then(realm => {
//                 realm.write(() => {
//                     realm.create('Cart', { foodId });
//                 });
//                 const cartItems = realm.objects('Cart');
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartItems,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(error => {
//                 console.error(error);
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// const removeFromCart = ({ foodId }) => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         Realm.open({ schema: [CartSchema] })
//             .then(realm => {
//                 const itemToRemove = realm.objects('Cart').filtered('foodId = $0', foodId);
//                 realm.write(() => {
//                     realm.delete(itemToRemove);
//                 });
//                 const cartItems = realm.objects('Cart');
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartItems,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(error => {
//                 console.error(error);
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// const getCartItems = () => {
//     return dispatch => {
//         dispatch({
//             type: types.SET_IS_LOADING,
//             payload: true,
//         });
//         Realm.open({ schema: [CartSchema] })
//             .then(realm => {
//                 const cartItems = realm.objects('Cart');
//                 dispatch({
//                     type: types.GET_CART_ITEMS,
//                     payload: cartItems,
//                 });
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             })
//             .catch(error => {
//                 console.error(error);
//                 dispatch({
//                     type: types.SET_IS_LOADING,
//                     payload: false,
//                 });
//             });
//     };
// };

// export default { types, addToCart, removeFromCart, getCartItems };

import { db } from "../SqlLiteDB";

const types = {
    GET_CART_ITEMS: 'GET_CART_ITEMS',
    SET_IS_LOADING: 'SET_IS_LOADING',
};

const addToCart = (foodId, quantity) => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql('INSERT INTO cart (foodId, quantity) VALUES (?, ?, ?);', [foodId, quantity, price]);
        },
        null,
        () => dispatch(getCartItems()) // Reload cart items after adding
    );
};

const removeFromCart = (id) => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql('DELETE FROM cart WHERE id = ?;', [id]);
        },
        null,
        () => dispatch(getCartItems()) // Reload cart items after removing
    );
};

const getCartItems = () => (dispatch) => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM cart;', [], (_, { rows }) => {
            dispatch({ type: types.GET_CART_ITEMS, payload: rows._array });
        });
    });
};

export default { types, addToCart, removeFromCart, getCartItems };
