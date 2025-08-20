import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Card from "../../components/Card";
import { api } from "../../lib/api";
import { withAuth } from "../../lib/withAuth";
import { 
  Star, 
  Search, 
  Filter, 
  Trash2, 
  Copy, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Crown,
  TrendingUp,
  X,
  Calendar,
  Shield,
  Clock,
  Award,
  DollarSign,
  Users
} from "lucide-react";

function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [influencersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    performance: 'all',
    dateRange: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await api.get("/influencers");
      setInfluencers(response || []);
    } catch (error) {
      console.error("Error fetching influencers:", error);
      setErrorMessage(error.message || "Failed to load influencers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInfluencer = async (influencerId) => {
    if (!confirm("Are you sure you want to delete this influencer?")) return;
    
    try {
      await api.delete(`/influencers/${influencerId}`);
      
      // Update local state
      setInfluencers(prevInfluencers => 
        prevInfluencers.filter(inf => inf.id !== influencerId)
      );
    } catch (error) {
      console.error("Error deleting influencer:", error);
      setErrorMessage("Failed to delete influencer");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      performance: 'all',
      dateRange: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getFilteredAndSortedInfluencers = () => {
    let filtered = influencers.filter(influencer => {
      const matchesSearch = influencer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           influencer.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPerformance = filters.performance === 'all' || 
        (filters.performance === 'top' && (influencer.referralCount || 0) >= 10) ||
        (filters.performance === 'medium' && (influencer.referralCount || 0) >= 5 && (influencer.referralCount || 0) < 10) ||
        (filters.performance === 'low' && (influencer.referralCount || 0) < 5);
      
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const influencerDate = new Date(influencer.createdAt || influencer.joinDate || Date.now());
        const now = new Date();
        const diffDays = Math.floor((now - influencerDate) / (1000 * 60 * 60 * 24));
        
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
      
      return matchesSearch && matchesPerformance && matchesDate;
    });

    // Sort influencers
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
        case 'referrals':
          aValue = a.referralCount || 0;
          bValue = b.referralCount || 0;
          break;
        case 'earnings':
          aValue = a.totalEarnings || 0;
          bValue = b.totalEarnings || 0;
          break;
        case 'date':
          aValue = new Date(a.createdAt || a.joinDate || Date.now());
          bValue = new Date(b.createdAt || b.joinDate || Date.now());
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

  const filteredInfluencers = getFilteredAndSortedInfluencers();
  const indexOfLastInfluencer = currentPage * influencersPerPage;
  const indexOfFirstInfluencer = indexOfLastInfluencer - influencersPerPage;
  const currentInfluencers = filteredInfluencers.slice(indexOfFirstInfluencer, indexOfLastInfluencer);
  const totalPages = Math.ceil(filteredInfluencers.length / influencersPerPage);

  const getTopPerformers = () => {
    return filteredInfluencers
      .sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0))
      .slice(0, 3);
  };

  const getFilterCount = (filterType, value) => {
    if (filterType === 'performance') {
      switch (value) {
        case 'top':
          return influencers.filter(inf => (inf.referralCount || 0) >= 10).length;
        case 'medium':
          return influencers.filter(inf => (inf.referralCount || 0) >= 5 && (inf.referralCount || 0) < 10).length;
        case 'low':
          return influencers.filter(inf => (inf.referralCount || 0) < 5).length;
        default:
          return influencers.length;
      }
    } else if (filterType === 'dateRange') {
      const now = new Date();
      return influencers.filter(inf => {
        const influencerDate = new Date(inf.createdAt || inf.joinDate || Date.now());
        const diffDays = Math.floor((now - influencerDate) / (1000 * 60 * 60 * 24));
        
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
            <Star className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Influencers</h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage and monitor your influencer network.</p>
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

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getTopPerformers().map((influencer, index) => (
            <Card key={influencer.id} className="card-hover group">
              <div className="flex items-center gap-3 transition-all duration-200 ease-out">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-lg ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                }`}>
                  {index === 0 ? (
                    <Crown className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-12" />
                  ) : index === 1 ? (
                    <Star className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-12" />
                  ) : (
                    <Award className="h-6 w-6 text-white transition-transform duration-200 group-hover:rotate-12" />
                  )}
                </div>
                <div className="flex-1 transition-all duration-200 ease-out">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {influencer.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                    {influencer.referralCount || 0} referrals
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="card-hover">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-200 ease-out">
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 transition-all duration-200 ease-out group-focus-within:text-blue-500 group-focus-within:scale-110" />
                <input
                  type="text"
                  placeholder="Search influencers..."
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
                  {/* Performance Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Performance
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All Performers', icon: Users },
                        { value: 'top', label: 'Top Performers', icon: Crown },
                        { value: 'medium', label: 'Medium Performers', icon: TrendingUp },
                        { value: 'low', label: 'Low Performers', icon: Clock }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => handleFilterChange('performance', value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out hover:scale-105 ${
                            filters.performance === value
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                          </div>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                            {getFilterCount('performance', value)}
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
                        { value: 'referrals', label: 'Referrals' },
                        { value: 'earnings', label: 'Earnings' },
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
                      {filters.performance !== 'all' && <span className="inline-block bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs mr-2">Performance: {filters.performance}</span>}
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

        {/* Influencers Table/Cards */}
        <Card title={`Influencers (${filteredInfluencers.length})`} subtitle="Manage influencer accounts and performance">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full skeleton rounded-xl"></div>
              ))}
            </div>
          ) : currentInfluencers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Influencer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Referral Link</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Referrals</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Rewards</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {currentInfluencers.map((influencer) => (
                      <tr key={influencer.id} className="table-row-hover group">
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                              <Star className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                            </div>
                            <div className="ml-4 transition-all duration-200 ease-out">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{influencer.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{influencer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap transition-all duration-200 ease-out">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200 font-mono">
                              {influencer.referralLink || 'N/A'}
                            </span>
                            <button
                              onClick={() => copyToClipboard(influencer.referralLink)}
                              className="btn-secondary text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                            >
                              <Copy className="h-3 w-3 transition-all duration-200 ease-out" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          {influencer.referralCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          ${influencer.totalEarnings || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out">
                          <button
                            onClick={() => handleDeleteInfluencer(influencer.id)}
                            className="btn-danger text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                          >
                            <Trash2 className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-4">
                {currentInfluencers.map((influencer) => (
                  <div key={influencer.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md group">
                    <div className="flex items-center justify-between mb-3 transition-all duration-200 ease-out">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                          <Star className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-3" />
                        </div>
                        <div className="transition-all duration-200 ease-out">
                          <div className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{influencer.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">{influencer.email}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                          {influencer.referralCount || 0} referrals
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">
                          ${influencer.totalEarnings || 0}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3 transition-all duration-200 ease-out">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Referral Link:</span>
                        <span className="text-xs text-gray-900 dark:text-gray-100 transition-colors duration-200 font-mono break-all">
                          {influencer.referralLink || 'N/A'}
                        </span>
                        <button
                          onClick={() => copyToClipboard(influencer.referralLink)}
                          className="btn-secondary text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                        >
                          <Copy className="h-3 w-3 transition-all duration-200 ease-out" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 transition-all duration-200 ease-out">
                      <button
                        onClick={() => handleDeleteInfluencer(influencer.id)}
                        className="btn-danger text-xs py-1 px-2 transition-all duration-200 ease-out hover:scale-105 active:scale-95"
                      >
                        <Trash2 className="h-3 w-3 mr-1 transition-all duration-200 ease-out" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-all duration-200 ease-out">
                  <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Showing {indexOfFirstInfluencer + 1} to {Math.min(indexOfLastInfluencer, filteredInfluencers.length)} of {filteredInfluencers.length} results
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
              <Star className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4 transition-all duration-200 ease-out" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">No influencers found</h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">
                {searchTerm || Object.values(filters).some(v => v !== 'all' && v !== 'name' && v !== 'asc')
                  ? "Try adjusting your search terms or filters."
                  : "No influencers have been registered yet."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

export default withAuth(AdminInfluencersPage, "admin");
