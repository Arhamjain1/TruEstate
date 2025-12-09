const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const AdmZip = require('adm-zip');
const { db, initDb } = require('./db');

const zipFilePath = path.resolve(__dirname, '../../dataset.zip');
const csvFileName = 'truestate_assignment_dataset.csv';

const importCsv = () => {
  initDb();

  console.log(`Checking for dataset...`);

  let csvPath = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');

  if (fs.existsSync(zipFilePath)) {
      console.log(`Found zip file at ${zipFilePath}. Extracting to disk...`);
      const zip = new AdmZip(zipFilePath);
      const zipEntries = zip.getEntries();
      const csvEntry = zipEntries.find(entry => entry.entryName === csvFileName || entry.entryName.endsWith('.csv'));
      
      if (!csvEntry) {
          console.error('CSV file not found in zip archive.');
          return;
      }
      
      // Extract to the same directory as the zip file
      const outputDir = path.dirname(zipFilePath);
      zip.extractEntryTo(csvEntry, outputDir, false, true);
      
      // The extracted file name (stripped of path)
      csvPath = path.join(outputDir, csvEntry.name);
      console.log(`Extracted to ${csvPath}`);
  } else if (!fs.existsSync(csvPath)) {
      console.error(`Dataset not found. Looked for ${zipFilePath} and ${csvPath}`);
      return;
  }

  console.log('Starting stream-based import...');
  
  let rowCount = 0;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run("DELETE FROM sales");

    const stmt = db.prepare(`INSERT INTO sales (
      transaction_id, date, customer_id, customer_name, phone_number, gender, age, customer_region, customer_type,
      product_id, product_name, brand, product_category, tags, quantity, price_per_unit,
      discount_percentage, total_amount, final_amount, payment_method, order_status,
      delivery_type, store_id, store_location, salesperson_id, employee_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
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
        rowCount++;
        if (rowCount % 5000 === 0) console.log(`Queued ${rowCount} rows...`);
      })
      .on('end', () => {
        console.log(`Finished parsing ${rowCount} rows. Finalizing transaction...`);
        stmt.finalize();
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error committing transaction:", err.message);
            } else {
                console.log("Import complete.");
                // Optional: Clean up extracted file to save space
                // fs.unlinkSync(csvPath); 
            }
        });
      })
      .on('error', (err) => {
          console.error("Error reading CSV:", err);
          db.run("ROLLBACK");
      });
  });
};

module.exports = importCsv;

if (require.main === module) {
    importCsv();
}
