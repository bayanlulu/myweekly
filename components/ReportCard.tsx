'use client';

import Link from 'next/link';
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

interface Task {
  title: string;
  timeSpent?: number;
  priority?: string;
}

interface Challenge {
  description: string;
  solution?: string;
}

interface IReport {
  _id: string;
  weekStartDate: Date;
  weekEndDate: Date;
  tasksCompleted: Task[];
  workInProgress: Task[];
  challenges: Challenge[];
  improvements?: string;
  nextWeekPlan?: string;
  summary?: string;
  status: 'draft' | 'submitted';
  submittedAt?: Date;
  createdAt: Date;
}

interface ReportCardProps {
  report: IReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalTasks = report.tasksCompleted.length + report.workInProgress.length;
  const completionRate = totalTasks > 0 
    ? Math.round((report.tasksCompleted.length / totalTasks) * 100) 
    : 0;

  return (
    <Link href={`/reports/${report._id}`} className="block">
      <div className="card hover:shadow-lg transition-all cursor-pointer">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-primary" />
            <div>
              <h3 className="text-lg font-bold text-text-primary">
                {formatDate(report.weekStartDate)} - {formatDate(report.weekEndDate)}
              </h3>
              {report.summary && (
                <p className="text-sm text-text-secondary line-clamp-1">{report.summary}</p>
              )}
            </div>
          </div>
          
          <span className={`badge ${report.status === 'submitted' ? 'badge-success' : 'badge-warning'}`}>
            {report.status === 'submitted' ? 'Submitted' : 'Draft'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <CheckCircle size={20} className="text-success mx-auto mb-1" />
            <p className="text-2xl font-black text-text-primary">{report.tasksCompleted.length}</p>
            <p className="text-xs text-text-secondary">Completed</p>
          </div>

          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <Clock size={20} className="text-warning mx-auto mb-1" />
            <p className="text-2xl font-black text-text-primary">{report.workInProgress.length}</p>
            <p className="text-xs text-text-secondary">Ongoing</p>
          </div>

          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <AlertCircle size={20} className="text-danger mx-auto mb-1" />
            <p className="text-2xl font-black text-text-primary">{report.challenges.length}</p>
            <p className="text-xs text-text-secondary">Challenges</p>
          </div>

          <div className="text-center p-3 bg-bg-secondary rounded-lg">
            <TrendingUp size={20} className="text-primary mx-auto mb-1" />
            <p className="text-2xl font-black text-text-primary">{completionRate}%</p>
            <p className="text-xs text-text-secondary">Rate</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-color text-sm text-text-secondary">
          <span>
            {report.submittedAt 
              ? `Submitted ${formatDate(report.submittedAt)}`
              : `Created ${formatDate(report.createdAt)}`
            }
          </span>
          <div className="flex items-center gap-1 text-primary font-semibold">
            View Details
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}