import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import { withAuth } from "../../lib/withAuth";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await api.get("/users");
      setUsers(response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage(error.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (userId, shouldBlock) => {
    try {
      const endpoint = shouldBlock ? `/users/${userId}/block` : `/users/${userId}/unblock`;
      await api.put(endpoint);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, status: shouldBlock ? 'blocked' : 'active' }
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      setErrorMessage("Failed to update user status");
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      dateRange: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || user.status === filters.status;
      
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const userDate = new Date(user.createdAt || user.signUpDate || Date.now());
        const now = new Date();
        const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today':
            matchesDate = diffDays === 0;
            break;
          case 'week':
            matchesDate = diffDays <= 7;
            break;
          case 'month':
            matchesDate = diffDays <= 30;
            break;
          case 'quarter':
            matchesDate = diffDays <= 90;
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt || a.signUpDate || Date.now());
          bValue = new Date(b.createdAt || b.signUpDate || Date.now());
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredUsers = getFilteredAndSortedUsers();
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ease-out hover:scale-105";
    
    switch (status) {
      case 'active':
        return `${baseClasses} status-active`;
      case 'blocked':
        return `${baseClasses} status-blocked`;
      default:
        return `${baseClasses} status-warning`;
    }
  };

  const getFilterCount = (filterType, value) => {
    if (filterType === 'status') {
      return users.filter(user => user.status === value).length;
    } else if (filterType === 'dateRange') {
      const now = new Date();
      return users.filter(user => {
        const userDate = new Date(user.createdAt || user.signUpDate || Date.now());
        const diffDays = Math.floor((now - userDate) / (1000 * 60 * 60 * 24));
        
        switch (value) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          default:
            return true;
        }
      }).length;
    }
    return 0;
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-8 transition-all duration-300 ease-out hover:scale-[1.01]">
          <div className="flex items-center gap-3 mb-2 group">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Users</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage all registered users in your system.</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-4 py-3 transition-all duration-300 ease-out animate-shake">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 transition-all duration-200 ease-out" />
              <p className="text-sm text-red-700 dark:text-red-300 transition-colors duration-200">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="card-hover">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-200 ease-out">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ease-out group-focus-within:text-blue-500 group-focus-within:scale-110" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-out hover:border-gray-400 dark:hover:border-gray-500 focus:scale-[1.02]"
                />
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn-secondary transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
                    showFilters ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                  }`}
                >
                  <Filter className="h-4 w-4 mr-2 transition-all duration-200 ease-out" />
                  Filters
                  {Object.values(filters).some(v => v !== 'all' && v !== 'name' && v !== 'asc') && (
                    <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </button>
                {(Object.values(filters).some(v => v !== 'all' && v !== 'name' && v !== 'asc') || searchTerm) && (
                  <button 
                    onClick={clearFilters}
                    className="btn-secondary text-xs py-2 px-3 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="space-y-2">
                      {['all', 'active', 'blocked', 'pending'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleFilterChange('status', status)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out hover:scale-105 ${
                            filters.status === status
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="capitalize">{status}</span>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                            {getFilterCount('status', status)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Time', icon: Clock },
                        { value: 'today', label: 'Today', icon: Calendar },
                        { value: 'week', label: 'This Week', icon: TrendingUp },
                        { value: 'month', label: 'This Month', icon: TrendingUp },
                        { value: 'quarter', label: 'This Quarter', icon: TrendingUp }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => handleFilterChange('dateRange', value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out hover:scale-105 ${
                            filters.dateRange === value
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </div>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                            {getFilterCount('dateRange', value)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort By Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'name', label: 'Name' },
                        { value: 'email', label: 'Email' },
                        { value: 'status', label: 'Status' },
                        { value: 'date', label: 'Date' }
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => handleFilterChange('sortBy', value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out hover:scale-105 ${
                            filters.sortBy === value
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{label}</span>
                          {filters.sortBy === value && (
                            <span className="text-xs bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              {filters.sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Order Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort Order
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'asc', label: 'Ascending', icon: '↑' },
                        { value: 'desc', label: 'Descending', icon: '↓' }
                      ].map(({ value, label, icon }) => (
                        <button
                          key={value}
                          onClick={() => handleFilterChange('sortOrder', value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out hover:scale-105 ${
                            filters.sortOrder === value
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span>{label}</span>
                          <span className="text-lg">{icon}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Active Filters:</span>
                    <span>
                      {filters.status !== 'all' && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-2">Status: {filters.status}</span>}
                      {filters.dateRange !== 'all' && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-2">Date: {filters.dateRange}</span>}
                      {filters.sortBy !== 'name' && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-2">Sort: {filters.sortBy}</span>}
                      {filters.sortOrder !== 'asc' && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-2">Order: {filters.sortOrder}</span>}
                      {searchTerm && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">Search: "{searchTerm}"</span>}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Users Table/Cards */}
        <Card title={`Users (${filteredUsers.length})`} subtitle="Manage user accounts and permissions">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full skeleton rounded-xl"></div>
              ))}
            </div>
          ) : currentUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="table-row-hover group">
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                              <Users className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                            </div>
                            <div className="ml-4 transition-all duration-200 ease-out">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <span className={getStatusBadge(user.status || 'active')}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out">
                          <div className="flex items-center gap-2">
                            {user.status === 'blocked' ? (
                              <button
                                onClick={() => handleBlockUser(user.id, false)}
                                className="btn-secondary text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                              >
                                <UserCheck className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlockUser(user.id, true)}
                                className="btn-danger text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                              >
                                <UserX className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                                Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {currentUsers.map((user) => (
                  <div key={user.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md group">
                    <div className="flex items-center justify-between mb-3 transition-all duration-200 ease-out">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                          <Users className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                        </div>
                        <div className="transition-all duration-200 ease-out">
                          <div className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{user.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{user.email}</div>
                        </div>
                      </div>
                      <span className={getStatusBadge(user.status || 'active')}>
                        {user.status || 'active'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 transition-all duration-200 ease-out">
                      {user.status === 'blocked' ? (
                        <button
                          onClick={() => handleBlockUser(user.id, false)}
                          className="btn-secondary text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                        >
                          <UserCheck className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user.id, true)}
                          className="btn-danger text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                        >
                          <UserX className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                          Block
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out">
                  <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} results
                  </div>
                  <div className="flex items-center gap-2 transition-all duration-200 ease-out">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="h-4 w-4 transition-all duration-200 ease-out" />
                    </button>
                    <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                      {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="h-4 w-4 transition-all duration-200 ease-out" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 transition-all duration-200 ease-out">
              <Users className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-all duration-200 ease-out" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">No users found</h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {searchTerm || Object.values(filters).some(v => v !== 'all' && v !== 'name' && v !== 'asc')
                  ? "Try adjusting your search terms or filters."
                  : "No users have been registered yet."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default withAuth(AdminUsersPage, "admin");
