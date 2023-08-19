import { db } from "../SqlLiteDB";

const types = {
    GET_CART_ITEMS: 'GET_CART_ITEMS',
    SET_IS_LOADING: 'SET_IS_LOADING',
};

const addToCart = (dishId, selectedSize, selectedToppings, selectedDippings, quantity) => (dispatch) => {
    return new Promise((resolve, reject) => { // Wrap the code inside a Promise
        // Construct the product object
        const product = {
            dishId: dishId,
            selectedSize: selectedSize,
            selectedToppings: selectedToppings,
            selectedDippings: selectedDippings
        };

        // Serialize the product object
        const serializedProduct = JSON.stringify(product);

        db.transaction(
            (tx) => {
                tx.executeSql(
                    'INSERT INTO cart (product_id, quantity) VALUES (?, ?);',
                    [serializedProduct, quantity],
                    null,
                    (_, error) => {
                        console.log("Database error:", error);
                        reject(error); // Reject the promise if there's an error
                    }
                );
            },
            null,
            () => {
                dispatch(getCartItems());
                resolve('OK'); // Resolve the promise with 'OK' if successful
            }
        );
    });
};

const removeFromCart = (cartItemId) => (dispatch) => {
    db.transaction(
        (tx) => {
            tx.executeSql('DELETE FROM cart WHERE id = ?;', [cartItemId]);
        },
        null,
        () => dispatch(getCartItems())
    );
};

const getCartItems = () => (dispatch) => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM cart;', [], (_, { rows }) => {
            const cartItems = rows._array.map(item => {
                // Parse the product_id field
                const product = JSON.parse(item.product_id);

                // Return a new object with the desired format
                return {
                    id: item.id,
                    dishId: product.dishId,
                    selectedSize: product.selectedSize,
                    selectedToppings: product.selectedToppings,
                    selectedDippings: product.selectedDippings,
                    quantity: item.quantity
                };
            });
            dispatch({ type: types.GET_CART_ITEMS, payload: cartItems });
        });
    });
};

export default { types, addToCart, removeFromCart, getCartItems };
