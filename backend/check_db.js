const { db } = require('./src/utils/db');

db.get("SELECT count(*) as count FROM sales", (err, row) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log(`Total rows in sales table: ${row.count}`);
  }
});
