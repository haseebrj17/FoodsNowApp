import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cart.db');

db.transaction((tx) => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, foodId NAVCHAR, quantity INTEGER, price INTEGER);'
    );
});

export default db;