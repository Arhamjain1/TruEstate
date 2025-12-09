import React, { useState, useEffect } from 'react';
import { getSales, getStats } from './services/api';
import Header from './components/Header';
import Filters from './components/Filters';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import DashboardStats from './components/DashboardStats';

function App() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const [filters, setFilters] = useState({
    search: '',
    region: [],
    category: [],
    paymentMethod: [],
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSales(filters);
      setData(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getStats();
      setStats(result);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSort = (key) => {
    setFilters(prev => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortBy === key && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header onSearch={handleSearch} />
        
        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Filters filters={filters} onFilterChange={handleFilterChange} />
          </div>
          
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : (
              <>
                <SalesTable 
                  data={data} 
                  onSort={handleSort} 
                  sortConfig={{ key: filters.sortBy, direction: filters.sortOrder }} 
                />
                <Pagination 
                  currentPage={pagination.currentPage} 
                  totalPages={pagination.totalPages} 
                  onPageChange={handlePageChange} 
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
