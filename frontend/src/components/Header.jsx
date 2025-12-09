import React from 'react';
import { Search } from 'lucide-react';

const Header = ({ onSearch }) => {
  return (
    <div className="bg-white p-4 shadow-sm flex justify-between items-center mb-6 rounded-lg">
      <h1 className="text-xl font-bold text-gray-800">Sales Management System</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by Name or Phone..."
          className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};

export default Header;
