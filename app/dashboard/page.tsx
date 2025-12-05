'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, CheckCircle, Clock, Award, Plus, Calendar, Target, Sparkles } from 'lucide-react';
import ReportCard from '@/components/ReportCard';
import { IReport } from '@/lib/models/Report';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchReports();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const totalReports = reports.length;
  const submittedReports = reports.filter(r => r.status === 'submitted').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;
  const recentReports = reports.slice(0, 5);
  const completionRate = totalReports > 0 ? Math.round((submittedReports / totalReports) * 100) : 0;

  return (
    <div className="min-h-screen gradient-light px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Welcome Card */}
        <div className="card">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-3">
            <Sparkles size={16} />
            <span>Dashboard</span>
          </div>
          <h1 className="text-4xl font-black text-text-primary mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-lg text-text-secondary">
            Here's your weekly progress overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <FileText size={28} className="text-white" />
            </div>
            <p className="text-3xl font-black text-text-primary mb-1">{totalReports}</p>
            <p className="text-sm text-text-secondary font-semibold">Total Reports</p>
          </div>

          <div className="card text-center hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <CheckCircle size={28} className="text-white" />
            </div>
            <p className="text-3xl font-black text-text-primary mb-1">{submittedReports}</p>
            <p className="text-sm text-text-secondary font-semibold">Submitted</p>
          </div>

          <div className="card text-center hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Clock size={28} className="text-white" />
            </div>
            <p className="text-3xl font-black text-text-primary mb-1">{draftReports}</p>
            <p className="text-sm text-text-secondary font-semibold">In Progress</p>
          </div>

          <div className="card text-center hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Award size={28} className="text-white" />
            </div>
            <p className="text-3xl font-black text-text-primary mb-1">{completionRate}%</p>
            <p className="text-sm text-text-secondary font-semibold">Completion</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/reports/create" className="btn btn-primary flex items-center justify-center gap-2 flex-1">
            <Plus size={20} />
            Create New Report
          </Link>

          <Link href="/reports" className="btn btn-secondary flex items-center justify-center gap-2 flex-1">
            <Calendar size={20} />
            View All Reports
          </Link>
        </div>

        {/* Recent Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <FileText size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary">Recent Reports</h2>
                <p className="text-sm text-text-secondary">Your latest submissions</p>
              </div>
            </div>
            {recentReports.length > 0 && (
              <Link href="/reports" className="text-primary font-semibold hover:underline text-sm">
                View All →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading your reports...</p>
            </div>
          ) : recentReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target size={32} className="text-text-tertiary" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No Reports Yet</h3>
              <p className="text-text-secondary mb-6">Start tracking your progress now!</p>
              <Link href="/reports/create" className="btn btn-primary inline-flex items-center gap-2">
                <Plus size={20} />
                Create Your First Report
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <ReportCard key={report._id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}