const { db } = require('../utils/db');

exports.getSales = (req, res) => {
  const {
    search,
    region,
    gender,
    minAge,
    maxAge,
    category,
    tags,
    paymentMethod,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = req.query;

  let query = "SELECT * FROM sales WHERE 1=1";
  let countQuery = "SELECT COUNT(*) as count FROM sales WHERE 1=1";
  const params = [];

  // Search
  if (search) {
    query += " AND (customer_name LIKE ? OR phone_number LIKE ?)";
    countQuery += " AND (customer_name LIKE ? OR phone_number LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  // Filters
  if (region) {
    const regions = Array.isArray(region) ? region : [region];
    if (regions.length > 0) {
      query += ` AND customer_region IN (${regions.map(() => '?').join(',')})`;
      countQuery += ` AND customer_region IN (${regions.map(() => '?').join(',')})`;
      params.push(...regions);
    }
  }

  if (gender) {
    const genders = Array.isArray(gender) ? gender : [gender];
    if (genders.length > 0) {
      query += ` AND gender IN (${genders.map(() => '?').join(',')})`;
      countQuery += ` AND gender IN (${genders.map(() => '?').join(',')})`;
      params.push(...genders);
    }
  }

  if (minAge) {
    query += " AND age >= ?";
    countQuery += " AND age >= ?";
    params.push(minAge);
  }

  if (maxAge) {
    query += " AND age <= ?";
    countQuery += " AND age <= ?";
    params.push(maxAge);
  }

  if (category) {
    const categories = Array.isArray(category) ? category : [category];
    if (categories.length > 0) {
      query += ` AND product_category IN (${categories.map(() => '?').join(',')})`;
      countQuery += ` AND product_category IN (${categories.map(() => '?').join(',')})`;
      params.push(...categories);
    }
  }
  
  if (paymentMethod) {
    const methods = Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod];
    if (methods.length > 0) {
      query += ` AND payment_method IN (${methods.map(() => '?').join(',')})`;
      countQuery += ` AND payment_method IN (${methods.map(() => '?').join(',')})`;
      params.push(...methods);
    }
  }

  if (startDate) {
    query += " AND date >= ?";
    countQuery += " AND date >= ?";
    params.push(startDate);
  }

  if (endDate) {
    query += " AND date <= ?";
    countQuery += " AND date <= ?";
    params.push(endDate);
  }

  // Sorting
  const validSortColumns = ['date', 'quantity', 'customer_name', 'total_amount'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'date';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  
  query += ` ORDER BY ${sortColumn} ${order}`;

  // Pagination
  const offset = (page - 1) * limit;
  query += " LIMIT ? OFFSET ?";
  const queryParams = [...params, limit, offset];

  // Execute
  db.get(countQuery, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const totalItems = row.count;
    const totalPages = Math.ceil(totalItems / limit);

    db.all(query, queryParams, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        data: rows,
        pagination: {
          totalItems,
          totalPages,
          currentPage: parseInt(page),
          pageSize: parseInt(limit)
        }
      });
    });
  });
};

exports.getStats = (req, res) => {
    // Simple stats for dashboard
    const query = `
        SELECT 
            COUNT(*) as total_units, 
            SUM(total_amount) as total_amount, 
            SUM(final_amount) as total_revenue,
            SUM(total_amount * discount_percentage / 100) as total_discount 
        FROM sales
    `;
    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
};
