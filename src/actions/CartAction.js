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

export const addToCart = ({ dishId, selectedSize, selectedExtras, selectedDips, quantity }) => (dispatch) => {
    dispatch(addToCartStart());
    return new Promise((resolve, reject) => {
        const product = {
            dishId: dishId,
            selectedSize: selectedSize,
            selectedToppings: selectedExtras,
            selectedDippings: selectedDips,
        };

        const serializedProduct = JSON.stringify(product);

        db.transaction(
            (tx) => {
                tx.executeSql(
                    'INSERT INTO cart (product_id, quantity) VALUES (?, ?);',
                    [serializedProduct, quantity], // Make sure the order is correct
                    (_, resultSet) => {
                        const cartItem = {
                            product: {
                                dishId: dishId,
                                selectedSize: selectedSize,
                                selectedExtras: selectedExtras,
                                selectedDips: selectedDips,
                            },
                            quantity: quantity,
                        };
                        dispatch(addToCartSuccess(cartItem));
                        resolve('OK');
                    },
                    (_, error) => {
                        console.log("Database error:", error);
                        dispatch(addToCartFailure(error));
                        reject(error);
                        return true;
                    }
                );
            },
            (error) => {
                console.log("Transaction error:", error);
                reject(error);
            },
            () => {
                resolve('OK');
            }
        );
    });
};

export const removeFromCart = (cartItemId) => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql(
                'DELETE FROM cart WHERE id = ?;',
                [cartItemId],
                null,
                (_, error) => {
                    // Handle error here, if needed
                    console.log("Database error while removing cart item:", error);
                    return true; // Stop the transaction if an error occurs
                }
            );
        },
        (error) => {
            // Handle transaction error here, if needed
            console.log("Transaction error while removing cart item:", error);
        },
        () => {
            // Refresh the cart items after successful removal
            dispatch(getCartItems());
        }
    );
};

export const getCartItems = () => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql(
                'SELECT * FROM cart;',
                [],
                (_, { rows }) => {
                    const cartItems = rows._array.map(item => {
                        return {
                            id: item.id,
                            product_id: item.product_id, // directly use product_id without parsing
                            quantity: item.quantity
                        };
                    });
                    dispatch({ type: GET_CART_ITEMS, payload: cartItems });
                },
                (_, error) => {
                    // Handle error here, if needed
                    console.log("Database error while getting cart items:", error);
                    return true; // Stop the transaction if an error occurs
                }
            );
        },
        (error) => {
            // Handle transaction error here, if needed
            console.log("Transaction error while getting cart items:", error);
        }
    );
};

export const incrementQuantity = (cartItemId) => (dispatch) => {
    dispatch(setSubLoading());
    db.transaction(
        (tx) => {
            tx.executeSql(
                'UPDATE cart SET quantity = quantity + 1 WHERE id = ?;',
                [cartItemId],
                (_, resultSet) => {
                    dispatch(getCartItems());
                    dispatch(unsetSubLoading());
                },
                (_, error) => {
                    console.log("Database error while incrementing quantity:", error);
                    dispatch(unsetSubLoading());
                    return true;
                }
            );
        },
        (error) => {
            console.log("Transaction error while incrementing quantity:", error);
            dispatch(unsetSubLoading());
        }
    );
};

export const decrementQuantity = (cartItemId) => (dispatch) => {
    dispatch(setSubLoading());
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                tx.executeSql(
                    'SELECT quantity FROM cart WHERE id = ?;',
                    [cartItemId],
                    (_, { rows }) => {
                        if (rows._array[0].quantity === 1) {
                            dispatch(removeFromCart(cartItemId));
                            dispatch(unsetSubLoading());
                            resolve();
                        } else {
                            tx.executeSql(
                                'UPDATE cart SET quantity = quantity - 1 WHERE id = ?;',
                                [cartItemId],
                                (_, resultSet) => {
                                    dispatch(getCartItems());
                                    dispatch(unsetSubLoading());
                                    resolve();
                                },
                                (_, error) => {
                                    console.log("Database error while decrementing quantity:", error);
                                    dispatch(unsetSubLoading());
                                    reject(error);
                                    return true;
                                }
                            );
                        }
                    },
                    (_, error) => {
                        console.log("Database error while checking item quantity:", error);
                        dispatch(unsetSubLoading());
                        reject(error);
                        return true;
                    }
                );
            },
            (error) => {
                console.log("Transaction error while decrementing quantity:", error);
                dispatch(unsetSubLoading());
                reject(error);
            },
            () => {
                dispatch(unsetSubLoading());
                resolve();
            }
        );
    });
};

export const clearCart = () => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql(
                'DELETE FROM cart;',
                [],
                null,
                (_, error) => {
                    console.log("Database error while clearing cart:", error);
                    return true;
                }
            );
        },
        (error) => {
            console.log("Transaction error while clearing cart:", error);
        },
        () => {
            dispatch(getCartItems());
        }
    );
};
