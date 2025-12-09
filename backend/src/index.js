const express = require('express');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');
const { initDb } = require('./utils/db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize DB
initDb();

// Routes
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
  res.send('Retail Sales Management API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
