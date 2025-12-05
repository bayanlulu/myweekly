'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReportCard from '@/components/ReportCard';
import { IReport } from '@/lib/models/Report';
import { 
  Plus, 
  RefreshCw, 
  Target, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  ArrowUpDown,
  Search
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Main component wrapped in Suspense for useSearchParams
export default function ReportsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReportsContent />
    </Suspense>
  );
}

function ReportsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';
  
  const [allReports, setAllReports] = useState<IReport[]>([]); // Store ALL reports for stats
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]); // Store filtered reports
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch ALL reports once on initial load for stats
  useEffect(() => {
    const controller = new AbortController();
    fetchAllReports(controller.signal);
    return () => controller.abort();
  }, []);

  // Fetch filtered reports when filter changes
  useEffect(() => {
    const controller = new AbortController();
    fetchFilteredReports(controller.signal);
    return () => controller.abort();
  }, [statusFilter]);

  // Fetch ALL reports (for statistics)
  const fetchAllReports = async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/reports', { signal });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to load reports');
      }

      const data = await res.json();
      setAllReports(Array.isArray(data.reports) ? data.reports : []);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Failed to fetch all reports', err);
    }
  };

  // Fetch filtered reports (for display)
  const fetchFilteredReports = async (signal?: AbortSignal) => {
    setLoading(true);

    try {
      const url = statusFilter === 'all' 
        ? '/api/reports' 
        : `/api/reports?status=${statusFilter}`;
      
      const res = await fetch(url, { signal });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Failed to load reports');
      }

      const data = await res.json();
      const reportsArray = Array.isArray(data.reports) ? data.reports : [];
      setFilteredReports(reportsArray);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Failed to fetch reports', err);
      toast.error(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  // Refresh both
  const refreshReports = () => {
    fetchAllReports();
    fetchFilteredReports();
  };

  // Apply search and sorting to filtered reports
  useEffect(() => {
    let results = [...filteredReports];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter((report: any) => {
        return (
          report.summary?.toLowerCase().includes(term) ||
          report.improvements?.toLowerCase().includes(term) ||
          report.nextWeekPlan?.toLowerCase().includes(term) ||
          report.tasksCompleted?.some((task: any) => 
            task.title?.toLowerCase().includes(term)
          ) ||
          report.workInProgress?.some((task: any) => 
            task.title?.toLowerCase().includes(term)
          )
        );
      });
    }
    
    // Apply sorting
    results.sort((a: any, b: any) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.weekStartDate).getTime();
        const dateB = new Date(b.weekStartDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Sort by status (draft first, then submitted)
        if (a.status === b.status) {
          const dateA = new Date(a.weekStartDate).getTime();
          const dateB = new Date(b.weekStartDate).getTime();
          return dateB - dateA;
        }
        return a.status === 'draft' ? -1 : 1;
      }
    });
    
    setFilteredReports(results);
  }, [searchTerm, sortBy, sortOrder]);

  // Handle search input
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle sort toggle
  const handleSort = (type: 'date' | 'status') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  // Calculate statistics from ALL reports
  const stats = useMemo(() => ({
    total: allReports.length,
    drafts: allReports.filter(r => r.status === 'draft').length,
    submitted: allReports.filter(r => r.status === 'submitted').length,
  }), [allReports]);

  // Get count for each tab - CORRECTED: Uses stats from allReports
  const getTabCount = (tabId: string) => {
    switch (tabId) {
      case 'draft':
        return stats.drafts;
      case 'submitted':
        return stats.submitted;
      case 'all':
      default:
        return stats.total;
    }
  };

  const TABS = [
    { id: 'all', label: 'All Reports', icon: FileText },
    { id: 'draft', label: 'Drafts', icon: AlertCircle },
    { id: 'submitted', label: 'Submitted', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen gradient-light px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 badge badge-primary mb-3">
                <Sparkles size={16} />
                <span>Dashboard</span>
              </div>
              <h1 className="text-4xl font-black text-text-primary dark:text-white mb-2">My Reports</h1>
              <p className="text-text-secondary dark:text-gray-300">View and manage all your weekly reports</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={refreshReports}
                className="btn btn-secondary flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <Link href="/reports/create" className="btn btn-primary flex items-center gap-2 flex-1 md:flex-initial">
                <Plus size={20} />
                New Report
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards - Shows counts from ALL reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-text-primary dark:text-white">{stats.total}</div>
                <div className="text-sm text-text-secondary dark:text-gray-300">Total Reports</div>
              </div>
            </div>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <AlertCircle className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.drafts}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Drafts</div>
              </div>
            </div>
          </div>
          
          <div className="card hover:shadow-lg transition-shadow border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.submitted}</div>
                <div className="text-sm text-green-600 dark:text-green-400">Submitted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Card */}
        <div className="card">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tabs - Shows correct counts from getTabCount function */}
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const isActive = statusFilter === tab.id;
                const Icon = tab.icon;
                const count = getTabCount(tab.id); // Uses correct count function
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => router.push(`/reports${tab.id === 'all' ? '' : `?status=${tab.id}`}`)}
                    className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-bg-secondary dark:bg-gray-800 text-text-primary dark:text-white hover:bg-bg-tertiary dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-white/30 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-secondary dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 text-text-primary dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Sort Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                    sortBy === 'date'
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                      : 'bg-bg-secondary dark:bg-gray-800 border-border dark:border-gray-700 text-text-primary dark:text-gray-300 hover:bg-bg-tertiary dark:hover:bg-gray-700'
                  }`}
                >
                  <Calendar size={16} />
                  <span className="font-medium text-sm">Date</span>
                  <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports List Card */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-text-secondary dark:text-gray-300">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <Target size={48} className="text-text-tertiary dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-text-primary dark:text-white mb-2">
                {searchTerm ? 'No matching reports found' : `No ${statusFilter !== 'all' ? statusFilter + ' ' : ''}reports found`}
              </h3>
              <p className="text-text-secondary dark:text-gray-400 mb-6">
                {searchTerm 
                  ? 'Try searching with different keywords'
                  : statusFilter === 'draft'
                    ? 'Start a new weekly report to create your first draft'
                    : statusFilter === 'submitted'
                      ? 'Submit a draft report to see it here'
                      : 'Create your first weekly report to get started'}
              </p>
              {!searchTerm && (
                <Link href="/reports/create" className="btn btn-primary inline-flex items-center gap-2">
                  <Plus size={20} />
                  Create Your First Report
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Info */}
              <div className="flex items-center justify-between text-sm text-text-secondary dark:text-gray-400 mb-2">
                <span>
                  Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
                  {searchTerm && ` for "${searchTerm}"`}
                  {statusFilter !== 'all' && ` (${statusFilter} only)`}
                  {filteredReports.length !== allReports.length && statusFilter === 'all' && 
                    ` of ${allReports.length} total`}
                </span>
                {sortBy === 'date' && (
                  <span className="flex items-center gap-1">
                    Sorted by {sortOrder === 'asc' ? 'Oldest' : 'Newest'} first
                  </span>
                )}
              </div>
              
              {/* Reports List - Shows filtered reports */}
              {filteredReports.map((report, index) => (
                <ReportCard 
                  key={(report as any)._id?.toString() || `report-${index}`} 
                  report={report} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen gradient-light flex items-center justify-center">
      <div className="text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-text-secondary dark:text-gray-300">Loading reports...</p>
      </div>
    </div>
  );
}