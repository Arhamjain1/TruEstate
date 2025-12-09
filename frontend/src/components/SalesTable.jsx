import React from 'react';

const SalesTable = ({ data, onSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  };

  if (data.length === 0) {
    return <div className="bg-white p-8 text-center text-gray-500 rounded-lg shadow-sm">No results found.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('date')}
            >
              Date {getSortIcon('date')}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('customer_name')}
            >
              Customer {getSortIcon('customer_name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              onClick={() => onSort('quantity')}
            >
              Qty {getSortIcon('quantity')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gross Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.transaction_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.customer_name}
                <div className="text-xs text-gray-400">{row.phone_number}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.product_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.product_category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{row.total_amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.discount_percentage}% 
                <span className="text-xs text-gray-400 block">
                  (₹{(row.total_amount * row.discount_percentage / 100).toLocaleString()})
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{row.final_amount.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.payment_method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
