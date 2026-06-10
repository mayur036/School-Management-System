import { useEffect, useMemo, useState } from 'react';

export function useDataTable({
  data = [],
  searchFilter,
  initialItemsPerPage = 10,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset to first page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleItemsPerPageChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    return data.filter((item) => {
      // 1. Filter by Status
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      if (!matchesStatus) return false;

      // 2. Filter by Search Query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();

      return searchFilter ? searchFilter(item, q) : true;
    });
  }, [data, searchQuery, statusFilter, searchFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return {
    // State
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,

    // Actions
    handleItemsPerPageChange,

    // Data
    filteredData,
    paginatedData,
    totalItems: filteredData.length,
    totalPages: Math.ceil(filteredData.length / itemsPerPage) || 1,
  };
}
