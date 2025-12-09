const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const AdmZip = require('adm-zip');
const { db, initDb } = require('./db');

const zipFilePath = path.resolve(__dirname, '../../dataset.zip');
const csvFileName = 'truestate_assignment_dataset.csv';

const importCsv = () => {
  initDb();

  const results = [];
  
  console.log(`Checking for dataset...`);

  let readStream;

  if (fs.existsSync(zipFilePath)) {
      console.log(`Found zip file at ${zipFilePath}. Extracting...`);
      const zip = new AdmZip(zipFilePath);
      const zipEntries = zip.getEntries();
      const csvEntry = zipEntries.find(entry => entry.entryName === csvFileName || entry.entryName.endsWith('.csv'));
      
      if (!csvEntry) {
          console.error('CSV file not found in zip archive.');
          return;
      }
      console.log(`Extracting ${csvEntry.entryName}...`);
      // Extract to buffer and create stream
      const buffer = csvEntry.getData();
      const { Readable } = require('stream');
      readStream = Readable.from(buffer);
  } else {
      // Fallback to local CSV if zip doesn't exist (dev environment)
      const localCsvPath = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');
      if (fs.existsSync(localCsvPath)) {
          console.log(`Found local CSV at ${localCsvPath}`);
          readStream = fs.createReadStream(localCsvPath);
      } else {
          console.error(`Dataset not found. Looked for ${zipFilePath} and ${localCsvPath}`);
          return;
      }
  }

  console.log('Parsing CSV...');

  readStream
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

module.exports = importCsv;

if (require.main === module) {
    importCsv();
}
