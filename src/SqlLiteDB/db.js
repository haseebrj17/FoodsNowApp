import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('cart.db');

db.transaction(tx => {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS cart (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id TEXT, quantity INTEGER);'
    );
});

export default db;