import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
  const regions = ['North', 'South', 'East', 'West', 'Central'];
  const categories = ['Electronics', 'Clothing', 'Home', 'Beauty', 'Sports'];
  const paymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'];

  const handleCheckboxChange = (key, value) => {
    const currentValues = Array.isArray(filters[key]) ? filters[key] : [];
    let newValues;
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    onFilterChange({ [key]: newValues });
  };

  const handleChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const renderCheckboxGroup = (title, key, options) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{title}</label>
      <div className="space-y-1 max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
            <input
              type="checkbox"
              checked={(filters[key] || []).includes(option)}
              onChange={() => handleCheckboxChange(key, option)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6 h-fit">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <button 
            onClick={() => onFilterChange({
                region: [],
                category: [],
                paymentMethod: [],
                startDate: '',
                endDate: ''
            })}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
            Reset All
        </button>
      </div>
      
      {renderCheckboxGroup('Region', 'region', regions)}
      {renderCheckboxGroup('Category', 'category', categories)}
      {renderCheckboxGroup('Payment Method', 'paymentMethod', paymentMethods)}

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">Date Range</label>
        <div className="flex flex-col space-y-2">
            <input 
            type="date" 
            className="block w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            />
            <input 
            type="date" 
            className="block w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            />
        </div>
      </div>
    </div>
  );
};

export default Filters;
