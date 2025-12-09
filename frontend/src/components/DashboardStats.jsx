import React from 'react';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
        <h3 className="text-sm font-medium text-gray-500">Total Units Sold</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.total_units}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
        <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
        <p className="text-2xl font-bold text-gray-900">₹{stats.total_revenue?.toLocaleString()}</p>
        <p className="text-xs text-gray-400">Gross: ₹{stats.total_amount?.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
        <h3 className="text-sm font-medium text-gray-500">Total Discount</h3>
        <p className="text-2xl font-bold text-gray-900">₹{stats.total_discount?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
