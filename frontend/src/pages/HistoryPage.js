import React, { useState, useEffect } from 'react';
import { useSummary } from '../context/SummaryContext';
import { historyAPI } from '../services/api';
import { Search, Filter, Calendar, Clock, Trash2, Eye, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const { userId, history, setHistory, removeFromHistory } = useSummary();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadHistory();
    loadStats();
  }, [userId, currentPage, searchTerm, selectedStyle]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        style: selectedStyle || undefined
      };

      const response = await historyAPI.getUserHistory(userId, params);
      setHistory(response.data.summaries || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to load history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await historyAPI.getUserStats(userId);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDelete = async (summaryId) => {
    if (!window.confirm('Are you sure you want to delete this summary?')) {
      return;
    }

    try {
      await historyAPI.deleteSummary(summaryId);
      removeFromHistory(summaryId);
      toast.success('Summary deleted successfully');
      loadStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to delete summary:', error);
      toast.error('Failed to delete summary');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadHistory();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStyle('');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Summary History</h1>
        <p className="text-lg text-gray-600">
          View and manage your previously generated summaries
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{stats.totalSummaries || 0}</div>
            <div className="text-sm text-gray-600">Total Summaries</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalEmailsSent || 0}</div>
            <div className="text-sm text-gray-600">Emails Sent</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(stats.averageWordCount || 0)}
            </div>
            <div className="text-sm text-gray-600">Avg Words</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((stats.totalProcessingTime || 0) / 1000)}s
            </div>
            <div className="text-sm text-gray-600">Total Processing</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search summaries..."
                className="input-field pl-10"
              />
            </div>

            {/* Style Filter */}
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="input-field"
            >
              <option value="">All Styles</option>
              <option value="executive">Executive Summary</option>
              <option value="action-items">Action Items</option>
              <option value="technical">Technical Notes</option>
              <option value="custom">Custom</option>
            </select>

            {/* Search Button */}
            <button type="submit" className="btn-primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedStyle) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Clear filters
            </button>
          )}
        </form>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No summaries found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedStyle 
                ? 'Try adjusting your search criteria' 
                : 'Generate your first summary to see it here'
              }
            </p>
          </div>
        ) : (
          <>
            {history.map((summary) => (
              <div key={summary._id} className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Header */}
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                        {summary.summaryStyle || 'Custom'}
                      </span>
                      {summary.metadata?.aiProvider && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {summary.metadata.aiProvider}
                        </span>
                      )}
                    </div>

                    {/* Prompt */}
                    <p className="text-sm text-gray-600">
                      <strong>Prompt:</strong> {truncateText(summary.prompt, 100)}
                    </p>

                    {/* Summary Preview */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-800">
                        {truncateText(summary.generatedSummary || summary.editedSummary || '', 200)}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(summary.createdAt)}</span>
                      </div>
                      <span>{summary.metadata?.wordCount || 0} words</span>
                      {summary.emailLogs?.length > 0 && (
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{summary.emailLogs.length} emails sent</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => window.open(`/summary/${summary._id}`, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="View full summary"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(summary._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                      title="Delete summary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
