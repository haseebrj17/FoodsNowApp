import { db } from "../SqlLiteDB";

export const GET_CART_ITEMS = 'GET_CART_ITEMS';
export const SET_IS_LOADING = 'SET_IS_LOADING';
export const ADD_TO_CART_START = 'ADD_TO_CART_START';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_FAILURE = 'ADD_TO_CART_FAILURE';
export const SET_SUB_LOADING = 'SET_SUB_LOADING';
export const UNSET_SUB_LOADING = 'UNSET_SUB_LOADING';
export const BEGIN_DECREMENTING = 'BEGIN_DECREMENTING';
export const END_DECREMENTING = 'END_DECREMENTING';

export const setSubLoading = () => ({
    type: SET_SUB_LOADING,
});

export const unsetSubLoading = () => ({
    type: UNSET_SUB_LOADING,
});

export const setIsLoading = (loading) => ({
    type: SET_IS_LOADING,
    payload: loading,
});

export const addToCartStart = () => ({
    type: ADD_TO_CART_START,
});

export const addToCartSuccess = (cartItem) => ({
    type: ADD_TO_CART_SUCCESS,
    payload: cartItem,
});

export const addToCartFailure = (error) => ({
    type: ADD_TO_CART_FAILURE,
    payload: error,
});

export const beginDecrementing = () => ({
    type: BEGIN_DECREMENTING,
})

export const endDecrementing = () => ({
    type: END_DECREMENTING,
})

const INSERT_INTO_CART_QUERY = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?);';
const DELETE_CART_ITEM_QUERY = 'DELETE FROM cart WHERE id = ?;';
const SELECT_ALL_CART_ITEMS_QUERY = 'SELECT * FROM cart;';
const INCREMENT_CART_ITEM_QUANTITY_QUERY = 'UPDATE cart SET quantity = quantity + 1 WHERE id = ?;';
const SELECT_CART_ITEM_QUANTITY_QUERY = 'SELECT quantity FROM cart WHERE id = ?;';
const DECREMENT_CART_ITEM_QUANTITY_QUERY = 'UPDATE cart SET quantity = quantity - 1 WHERE id = ?;';
const DELETE_ALL_FROM_CART_QUERY = 'DELETE FROM cart;';

export const addToCart = ({ dishId, selectedSize, selectedExtras, selectedDips, quantity }) => (dispatch) => {
    dispatch(addToCartStart());
    return new Promise(async (resolve, reject) => {
        try {
            const product = {
                dishId: dishId,
                selectedSize: selectedSize,
                selectedToppings: selectedExtras,
                selectedDippings: selectedDips,
            };
            const serializedProduct = JSON.stringify(product);
            await db.transaction(
                (tx) => {
                    tx.executeSql(
                        INSERT_INTO_CART_QUERY,
                        [serializedProduct, quantity],
                        (_, resultSet) => {
                            const cartItem = {
                                product: product,
                                quantity: quantity,
                            };
                            dispatch(addToCartSuccess(cartItem));
                            resolve('OK');
                        },
                        (_, error) => {
                            console.error("Error adding to cart:", error.message);
                            dispatch(addToCartFailure(error));
                            reject(error);
                        }
                    );
                }
            );
        } catch (error) {
            console.error("Database or Transaction error:", error.message);
            reject(error);
        }
    });
};


export const removeFromCart = (cartItemId) => async (dispatch) => {
    try {
        await db.transaction((tx) => {
            tx.executeSql(
                DELETE_CART_ITEM_QUERY,
                [cartItemId],
                () => {
                    dispatch(getCartItems());
                },
                (_, error) => {
                    console.error("Error removing cart item:", error.message);
                    throw error;
                }
            );
        });
    } catch (error) {
        console.error("Transaction error:", error.message);
    }
};

export const getCartItems = () => async (dispatch) => {
    try {
        await db.transaction((tx) => {
            tx.executeSql(
                SELECT_ALL_CART_ITEMS_QUERY,
                [],
                (_, { rows }) => {
                    const cartItems = rows._array.map(item => ({
                        id: item.id,
                        product_id: item.product_id,
                        quantity: item.quantity
                    }));
                    dispatch({ type: GET_CART_ITEMS, payload: cartItems });
                },
                (_, error) => {
                    console.error("Error getting cart items:", error.message);
                    throw error;
                }
            );
        });
    } catch (error) {
        console.error("Transaction error:", error.message);
    }
};

export const incrementQuantity = (cartItemId) => async (dispatch) => {
    dispatch(setSubLoading());
    try {
        await db.transaction((tx) => {
            tx.executeSql(
                INCREMENT_CART_ITEM_QUANTITY_QUERY,
                [cartItemId],
                () => {
                    dispatch(getCartItems());
                    dispatch(unsetSubLoading());
                },
                (_, error) => {
                    console.error("Error incrementing quantity:", error.message);
                    dispatch(unsetSubLoading());
                    throw error;
                }
            );
        });
    } catch (error) {
        console.error("Transaction error:", error.message);
        dispatch(unsetSubLoading());
    }
};

export const decrementQuantity = (cartItemId) => async (dispatch) => {
    dispatch(setSubLoading());
    try {
        await db.transaction(async (tx) => {
            tx.executeSql(
                SELECT_CART_ITEM_QUANTITY_QUERY,
                [cartItemId],
                (_, { rows }) => {
                    const currentQuantity = rows._array[0].quantity;
                    if (currentQuantity === 1) {
                        dispatch(removeFromCart(cartItemId));
                        dispatch(unsetSubLoading());
                    } else {
                        tx.executeSql(
                            DECREMENT_CART_ITEM_QUANTITY_QUERY,
                            [cartItemId],
                            () => {
                                dispatch(getCartItems());
                                dispatch(unsetSubLoading());
                            },
                            (_, error) => {
                                console.error("Error decrementing quantity:", error.message);
                                dispatch(unsetSubLoading());
                                throw error;
                            }
                        );
                    }
                },
                (_, error) => {
                    console.error("Error checking item quantity:", error.message);
                    dispatch(unsetSubLoading());
                    throw error;
                }
            );
        });
    } catch (error) {
        console.error("Transaction error:", error.message);
        dispatch(unsetSubLoading());
    }
};

export const clearCart = () => async (dispatch) => {
    try {
        await db.transaction(
            (tx) => {
                tx.executeSql(
                    DELETE_ALL_FROM_CART_QUERY,
                    [],
                    null,
                    (_, error) => {
                        console.error("Error clearing cart:", error.message);
                        throw error;
                    }
                );
            }
        );
        dispatch(getCartItems());
    } catch (error) {
        console.error("Database or Transaction error:", error.message);
    }
};