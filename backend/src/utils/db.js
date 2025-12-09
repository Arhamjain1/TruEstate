const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS sales (
        transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        customer_id TEXT,
        customer_name TEXT,
        phone_number TEXT,
        gender TEXT,
        age INTEGER,
        customer_region TEXT,
        customer_type TEXT,
        product_id TEXT,
        product_name TEXT,
        brand TEXT,
        product_category TEXT,
        tags TEXT,
        quantity INTEGER,
        price_per_unit REAL,
        discount_percentage REAL,
        total_amount REAL,
        final_amount REAL,
        payment_method TEXT,
        order_status TEXT,
        delivery_type TEXT,
        store_id TEXT,
        store_location TEXT,
        salesperson_id TEXT,
        employee_name TEXT
      )
    `);
  });
};

module.exports = { db, initDb };
