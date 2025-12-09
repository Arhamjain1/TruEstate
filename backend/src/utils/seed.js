const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { db, initDb } = require('./db');

const csvFilePath = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');

const importCsv = () => {
  initDb();

  const results = [];
  
  console.log(`Reading CSV from ${csvFilePath}...`);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    return;
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(`Parsed ${results.length} rows. Inserting into database...`);
      
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");
        
        // Clear existing data
        db.run("DELETE FROM sales");

        const stmt = db.prepare(`INSERT INTO sales (
          transaction_id, date, customer_id, customer_name, phone_number, gender, age, customer_region, customer_type,
          product_id, product_name, brand, product_category, tags, quantity, price_per_unit,
          discount_percentage, total_amount, final_amount, payment_method, order_status,
          delivery_type, store_id, store_location, salesperson_id, employee_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

        let count = 0;
        results.forEach((row) => {
          // Map CSV columns to DB columns
          // Adjust keys based on actual CSV headers
          stmt.run(
            row['Transaction ID'],
            row['Date'],
            row['Customer ID'],
            row['Customer Name'],
            row['Phone Number'],
            row['Gender'],
            row['Age'],
            row['Customer Region'],
            row['Customer Type'],
            row['Product ID'],
            row['Product Name'],
            row['Brand'],
            row['Product Category'],
            row['Tags'],
            row['Quantity'],
            row['Price per Unit'],
            row['Discount Percentage'],
            row['Total Amount'],
            row['Final Amount'],
            row['Payment Method'],
            row['Order Status'],
            row['Delivery Type'],
            row['Store ID'],
            row['Store Location'],
            row['Salesperson ID'],
            row['Employee Name']
          );
          count++;
          if (count % 10000 === 0) console.log(`Inserted ${count} rows...`);
        });

        stmt.finalize();
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error committing transaction:", err.message);
            } else {
                console.log("Import complete.");
            }
        });
      });
    });
};

importCsv();
