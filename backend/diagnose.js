const { db } = require('./src/utils/db');

const runDiagnostics = () => {
  db.serialize(() => {
    // Check for invalid discounts
    db.get("SELECT COUNT(*) as count FROM sales WHERE discount_percentage > 100", (err, row) => {
      console.log(`Rows with discount > 100%: ${row?.count}`);
    });

    // Check for invalid amounts
    db.get("SELECT COUNT(*) as count FROM sales WHERE final_amount > total_amount", (err, row) => {
      console.log(`Rows where Final Amount > Total Amount: ${row?.count}`);
    });

    // Check sums
    db.get(`
      SELECT 
        SUM(total_amount) as total_sales,
        SUM(total_amount * discount_percentage / 100) as calculated_discount,
        SUM(total_amount - final_amount) as actual_difference
      FROM sales
    `, (err, row) => {
      console.log('--- Aggregate Stats ---');
      console.log(`Total Sales (Sum of Total Amount): ${row?.total_sales}`);
      console.log(`Calculated Discount (Sum of Total * Discount%): ${row?.calculated_discount}`);
      console.log(`Actual Difference (Sum of Total - Final): ${row?.actual_difference}`);
      
      if (row?.calculated_discount > row?.total_sales) {
        console.log("WARNING: Total Discount is greater than Total Sales!");
      } else {
        console.log("Total Discount is less than Total Sales (Correct).");
      }
    });
    
    // Check a sample row
    db.get("SELECT * FROM sales LIMIT 1", (err, row) => {
        console.log('--- Sample Row ---');
        console.log(row);
    });
  });
};

runDiagnostics();
