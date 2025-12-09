const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const { initDb, db } = require('./utils/db');
const importCsv = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize DB and Seed if empty
initDb();

db.get("SELECT COUNT(*) as count FROM sales", (err, row) => {
    if (err) {
        // Table might not exist yet, initDb is async in structure but run is serialized
        console.log("Checking DB status...");
    } else if (row && row.count === 0) {
        console.log("Database is empty. Starting seed process...");
        importCsv();
    } else {
        console.log(`Database has ${row.count} records. Skipping seed.`);
    }
});

// Routes
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
  res.send('Retail Sales Management API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
