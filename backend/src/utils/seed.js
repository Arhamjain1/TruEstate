const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const yauzl = require('yauzl');
const { Writable } = require('stream');
const { db, initDb } = require('./db');

const zipFilePath = path.resolve(__dirname, '../../dataset.zip');
const csvFileName = 'truestate_assignment_dataset.csv';

const importCsv = () => {
  initDb();

  console.log(`Checking for dataset...`);

  // Check if local CSV exists (dev mode)
  const localCsvPath = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');
  if (fs.existsSync(localCsvPath)) {
      console.log(`Found local CSV at ${localCsvPath}`);
      processStream(fs.createReadStream(localCsvPath));
      return;
  }

  if (fs.existsSync(zipFilePath)) {
      console.log(`Found zip file at ${zipFilePath}. Streaming extraction...`);
      
      yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
          if (err) throw err;
          
          zipfile.readEntry();
          
          zipfile.on('entry', (entry) => {
              if (entry.fileName === csvFileName || entry.fileName.endsWith('.csv')) {
                  console.log(`Found CSV entry: ${entry.fileName}`);
                  zipfile.openReadStream(entry, (err, readStream) => {
                      if (err) throw err;
                      processStream(readStream);
                  });
              } else {
                  zipfile.readEntry();
              }
          });
      });
  } else {
      console.error(`Dataset not found. Looked for ${zipFilePath} and ${localCsvPath}`);
  }
};

const processStream = (stream) => {
  console.log('Starting stream-based import with backpressure...');
  
  let rowCount = 0;
  const BATCH_SIZE = 500; 

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run("DELETE FROM sales");

    const stmt = db.prepare(`INSERT INTO sales (
      transaction_id, date, customer_id, customer_name, phone_number, gender, age, customer_region, customer_type,
      product_id, product_name, brand, product_category, tags, quantity, price_per_unit,
      discount_percentage, total_amount, final_amount, payment_method, order_status,
      delivery_type, store_id, store_location, salesperson_id, employee_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    // Create a Writable stream to handle backpressure
    const dbWriter = new Writable({
        objectMode: true,
        write(row, encoding, callback) {
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
                row['Employee Name'],
                (err) => {
                    if (err) return callback(err);
                    
                    rowCount++;
                    if (rowCount % BATCH_SIZE === 0) {
                        console.log(`Processed ${rowCount} rows...`);
                        // Commit and restart transaction to free memory
                        db.run("COMMIT", () => {
                            db.run("BEGIN TRANSACTION", () => {
                                // Small delay to allow GC to catch up if needed
                                setImmediate(callback);
                            });
                        });
                    } else {
                        callback();
                    }
                }
            );
        }
    });

    stream
      .pipe(csv())
      .pipe(dbWriter)
      .on('finish', () => {
        console.log(`Finished parsing ${rowCount} rows. Finalizing...`);
        stmt.finalize();
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error committing transaction:", err.message);
            } else {
                console.log("Import complete.");
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
