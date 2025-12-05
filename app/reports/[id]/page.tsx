'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Target,
  FileText,
  CalendarDays,
  ChevronRight,
} from 'lucide-react';
import { IReport } from '@/lib/models/Report';
import PDFExport from '@/components/PDFExport';



export default function ViewReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<IReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [deleting, setDeleting] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Load report when page opens
  useEffect(() => {
    fetchReport();
  }, [reportId]);

  // Get report from API
  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}`);

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        toast.error('Report not found');
        router.push('/reports');
      }
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  // Delete report
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${report?.status === 'draft' ? 'draft' : 'report'}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success(`${report?.status === 'draft' ? 'Draft' : 'Report'} deleted successfully`);
        router.push('/reports');
      } else {
        toast.error('Failed to delete report');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  // Edit report
  const handleEdit = () => {
    if (report?.status === 'draft') {
      router.push(`/reports/create?edit=${reportId}`);
    } else {
      toast.error('Submitted reports cannot be edited');
    }
  };






  // Format date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Calculate stats
  const calculateStats = () => {
    if (!report) return { totalHours: 0, highPriorityTasks: 0, completedCount: 0 };

    const totalHours = (report.tasksCompleted || []).reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    const highPriorityTasks = (report.tasksCompleted || []).filter(t => t.priority?.toLowerCase() === 'high').length;

    return {
      totalHours,
      highPriorityTasks,
      completedCount: (report.tasksCompleted || []).length,
      wipCount: (report.workInProgress || []).length,
      challengesCount: (report.challenges || []).length,
    };
  };

  const stats = report ? calculateStats() : null;

  // Navigation items
  const navItems = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'completed', label: 'Tasks Completed', icon: CheckCircle, count: report?.tasksCompleted?.length },
    { id: 'progress', label: 'Work in Progress', icon: TrendingUp, count: report?.workInProgress?.length },
    { id: 'challenges', label: 'Challenges', icon: AlertCircle, count: report?.challenges?.length },
    { id: 'improvements', label: 'Learnings', icon: Target },
    { id: 'nextweek', label: 'Next Week Plan', icon: CalendarDays },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Report Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The report you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => router.push('/reports')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
          >
            <ArrowLeft size={18} />
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const weekNumber = getWeekNumber(new Date(report.weekStartDate));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 print:py-0 print:bg-white">
      <div className="container mx-auto px-4 max-w-7xl print:max-w-full">

        {/* Back button */}
        <button
          onClick={() => router.push('/reports')}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 mb-8 transition-all group print:hidden"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Reports</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left sidebar - Navigation */}
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-8">
              {/* Report Info Card */}
              <div className={`p-6 bg-gradient-to-r ${report.status === 'submitted'
                  ? 'from-green-600 to-emerald-600'
                  : 'from-blue-600 to-cyan-600'
                } text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-xl font-bold">Weekly Report</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${report.status === 'submitted'
                        ? 'bg-green-500/20 text-green-100'
                        : 'bg-yellow-500/20 text-yellow-100'
                      }`}
                  >
                    {report.status === 'submitted' ? 'SUBMITTED' : 'DRAFT'}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm opacity-90">Week {weekNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    <span className="text-sm opacity-90">
                      {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="text-sm opacity-90">
                      {report.status === 'submitted'
                        ? `Submitted ${formatDate(report.submittedAt || report.createdAt)}`
                        : `Created ${formatDate(report.createdAt)}`
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isActive
                              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.count !== undefined && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isActive
                                  ? 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                {item.count}
                              </span>
                            )}
                            <ChevronRight size={16} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Stats Card */}
              {stats && (
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3">Report Stats</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.completedCount}</div>
                      <div className="text-xs text-blue-600 dark:text-blue-300">Tasks Done</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalHours}h</div>
                      <div className="text-xs text-green-600 dark:text-green-300">Total Hours</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.wipCount}</div>
                      <div className="text-xs text-orange-600 dark:text-orange-300">In Progress</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.challengesCount}</div>
                      <div className="text-xs text-red-600 dark:text-red-300">Challenges</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                {report.status === 'draft' && (
                  <button
                    onClick={handleEdit}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                  >
                    <Edit size={18} />
                    Edit Draft
                  </button>
                )}

                <div className="flex gap-2">
                  <div className="flex-1">
                    <PDFExport report={report} />
                  </div>
                </div>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete {report.status === 'draft' ? 'Draft' : 'Report'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Print Header (only shows when printing) */}
            <div className="hidden print:block mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Report</h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${report.status === 'submitted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                  }`}>
                  {report.status === 'submitted' ? 'Submitted' : 'Draft'}
                </span>
              </div>
            </div>

            {/* Summary Section */}
            {activeSection === 'summary' && report.summary && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl print:hidden">
                    <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Weekly Summary</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">Overview of your week's accomplishments</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none dark:prose-invert print:prose-sm">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                    {report.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Tasks Completed Section */}
            {activeSection === 'completed' && report.tasksCompleted?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl print:hidden">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Tasks Completed</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">What you accomplished this week</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {report.tasksCompleted.map((task, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-green-100 dark:border-green-900/30 print:border-gray-200 print:bg-gray-50 print:p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-bold print:bg-gray-200 print:text-gray-700">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white print:text-base print:font-bold">
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 pl-11 print:pl-9">
                            {task.timeSpent && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 print:text-gray-700">
                                <Clock size={16} className="print:hidden" />
                                <span className="font-medium">{task.timeSpent} hours</span>
                              </div>
                            )}
                            {task.priority && (
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${task.priority === 'High'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 print:bg-red-50 print:text-red-700'
                                    : task.priority === 'Medium'
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 print:bg-yellow-50 print:text-yellow-700'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 print:bg-blue-50 print:text-blue-700'
                                  }`}
                              >
                                {task.priority} Priority
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work in Progress Section */}
            {activeSection === 'progress' && report.workInProgress?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl print:hidden">
                    <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Work in Progress</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">Tasks currently being worked on</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {report.workInProgress.map((task, index) => (
                    <div key={index} className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl border border-orange-100 dark:border-orange-900/30 print:border-gray-200 print:bg-gray-50 print:p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 font-bold print:bg-gray-200 print:text-gray-700">
                              {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white print:text-base print:font-bold">
                              {task.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 pl-11 print:pl-9">
                            {task.timeSpent && (
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 print:text-gray-700">
                                <Clock size={16} className="print:hidden" />
                                <span className="font-medium">{task.timeSpent} hours invested</span>
                              </div>
                            )}
                            {task.priority && (
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${task.priority === 'High'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 print:bg-red-50 print:text-red-700'
                                    : task.priority === 'Medium'
                                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 print:bg-yellow-50 print:text-yellow-700'
                                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 print:bg-blue-50 print:text-blue-700'
                                  }`}
                              >
                                {task.priority} Priority
                              </span>
                            )}
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium print:bg-blue-50 print:text-blue-700">
                              In Progress
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges Section */}
            {activeSection === 'challenges' && report.challenges?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl print:hidden">
                    <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Challenges Faced</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">Obstacles encountered and solutions</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {report.challenges.map((challenge, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-5 py-1 print:border-gray-300 print:pl-3">
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl print:bg-gray-50 print:p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 font-bold print:bg-gray-200 print:text-gray-700">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white print:text-base print:font-bold">Challenge</h3>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 pl-11 print:pl-9 print:text-gray-800">
                          {challenge.description}
                        </p>

                        {challenge.solution && (
                          <>
                            <div className="flex items-center gap-3 mb-4 pl-11 print:pl-9">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 print:bg-gray-200 print:text-gray-700">
                                <CheckCircle size={14} />
                              </div>
                              <h4 className="font-semibold text-gray-900 dark:text-white print:text-base">Solution Applied</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pl-11 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg print:pl-9 print:bg-gray-100 print:text-gray-800 print:p-3">
                              {challenge.solution}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements Section */}
            {activeSection === 'improvements' && report.improvements && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl print:hidden">
                    <Target className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Learnings & Improvements</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">Key takeaways and growth areas</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none dark:prose-invert print:prose-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl print:bg-gray-50 print:p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                      {report.improvements}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Week Plan Section */}
            {activeSection === 'nextweek' && report.nextWeekPlan && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 print:shadow-none print:border-none print:p-0 print:bg-transparent">
                <div className="flex items-center gap-3 mb-6 print:mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl print:hidden">
                    <CalendarDays className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white print:text-xl">Next Week Plan</h2>
                    <p className="text-gray-600 dark:text-gray-300 print:hidden">Goals and objectives for upcoming week</p>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none dark:prose-invert print:prose-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl print:bg-gray-50 print:p-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap print:text-gray-800">
                      {report.nextWeekPlan}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {activeSection !== 'summary' &&
              activeSection !== 'completed' &&
              activeSection !== 'progress' &&
              activeSection !== 'challenges' &&
              activeSection !== 'improvements' &&
              activeSection !== 'nextweek' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Content Available</h3>
                  <p className="text-gray-600 dark:text-gray-300">This section doesn't have any content in this report.</p>
                </div>
              )}

            {/* Report Metadata */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 print:hidden">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Report Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {formatDate(report.createdAt)}
                  </div>
                </div>
                {report.submittedAt && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Submitted</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(report.submittedAt)}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Report ID</div>
                  <div className="font-mono text-sm text-gray-600 dark:text-gray-300 truncate">
                    {report._id}
                  </div>
                </div>
              </div>
            </div>

            {/* Print footer */}
            <div className="hidden print:block mt-8 pt-4 border-t border-gray-300">
              <p className="text-sm text-gray-600">
                Generated on {new Date().toLocaleDateString()} • Weekly Report System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionsMenu(false)}
        />
      )}
    </div>
  );
}