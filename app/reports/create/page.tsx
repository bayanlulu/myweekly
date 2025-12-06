'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plus, X, Save, Send, ChevronLeft, ChevronRight, Calendar, Clock, Edit, Eye, Trash2, CheckCircle, AlertCircle, TrendingUp, Target, FileText, CalendarDays } from 'lucide-react';

// Interface for a single task
interface Task {
  title: string;
  timeSpent?: number;
  priority?: string;
}

// Interface for a challenge
interface Challenge {
  description: string;
  solution?: string;
}

// Main component that uses useSearchParams
function CreateReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [loading, setLoading] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [originalReport, setOriginalReport] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = last week, etc.

  // Function to get week dates based on offset
  const getWeekDates = (offset = 0) => {
    const today = new Date();
    
    // Adjust for week offset
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + (offset * 7));
    
    const day = targetDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // Calculate Saturday
    const saturday = new Date(targetDate);
    const daysUntilSaturday = (6 - day + 7) % 7;
    saturday.setDate(targetDate.getDate() + daysUntilSaturday);
    
    // Calculate Thursday (5 days after Saturday)
    const thursday = new Date(saturday);
    thursday.setDate(saturday.getDate() + 5);
    
    return {
      start: saturday.toISOString().split('T')[0],
      end: thursday.toISOString().split('T')[0],
      saturdayDate: saturday,
      thursdayDate: thursday,
    };
  };

  // State for form fields
  const [weekStartDate, setWeekStartDate] = useState('');
  const [weekEndDate, setWeekEndDate] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState<Task[]>([
    { title: '', timeSpent: undefined, priority: 'Medium' }
  ]);
  const [workInProgress, setWorkInProgress] = useState<Task[]>([
    { title: '', timeSpent: undefined, priority: 'Medium' }
  ]);
  const [challenges, setChallenges] = useState<Challenge[]>([
    { description: '', solution: '' }
  ]);
  const [improvements, setImprovements] = useState('');
  const [nextWeekPlan, setNextWeekPlan] = useState('');
  const [summary, setSummary] = useState('');

  // Check if we're editing a draft
  useEffect(() => {
    if (editId) {
      loadDraftForEditing(editId);
    } else {
      // Initialize with current week
      const dates = getWeekDates(0);
      setWeekStartDate(dates.start);
      setWeekEndDate(dates.end);
      setWeekOffset(0);
    }
  }, [editId]);

  // Update dates when weekOffset changes
  useEffect(() => {
    if (!isEditingDraft) {
      const newDates = getWeekDates(weekOffset);
      setWeekStartDate(newDates.start);
      setWeekEndDate(newDates.end);
    }
  }, [weekOffset, isEditingDraft]);

  const loadDraftForEditing = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        const report = data.report;
        
        if (report.status !== 'draft') {
          toast.error('Only draft reports can be edited');
          router.push('/reports/create');
          return;
        }
        
        setOriginalReport(report);
        setIsEditingDraft(true);
        
        // Populate form with draft data
        setWeekStartDate(new Date(report.weekStartDate).toISOString().split('T')[0]);
        setWeekEndDate(new Date(report.weekEndDate).toISOString().split('T')[0]);
        setTasksCompleted(report.tasksCompleted?.length > 0 ? report.tasksCompleted : [{ title: '', priority: 'Medium' }]);
        setWorkInProgress(report.workInProgress?.length > 0 ? report.workInProgress : [{ title: '', priority: 'Medium' }]);
        setChallenges(report.challenges?.length > 0 ? report.challenges : [{ description: '', solution: '' }]);
        setImprovements(report.improvements || '');
        setNextWeekPlan(report.nextWeekPlan || '');
        setSummary(report.summary || '');
        
        toast.success('Draft loaded for editing');
      } else {
        toast.error('Draft not found');
        router.push('/reports/create');
      }
    } catch (error) {
      toast.error('Failed to load draft');
    } finally {
      setLoading(false);
    }
  };

  // ===== WEEK NAVIGATION FUNCTIONS =====
  const goToPreviousWeek = () => {
    if (!isEditingDraft) {
      setWeekOffset(prev => prev - 1);
    }
  };

  const goToNextWeek = () => {
    if (!isEditingDraft) {
      setWeekOffset(prev => prev + 1);
    }
  };

  const goToCurrentWeek = () => {
    if (!isEditingDraft) {
      setWeekOffset(0);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get week label
  const getWeekLabel = () => {
    if (weekOffset === 0) return 'Current Week';
    if (weekOffset === -1) return 'Last Week';
    if (weekOffset === 1) return 'Next Week';
    if (weekOffset < 0) return `${Math.abs(weekOffset)} Weeks Ago`;
    return `In ${weekOffset} Weeks`;
  };

  // ===== TASK MANAGEMENT FUNCTIONS =====
  const addCompletedTask = () => {
    setTasksCompleted([...tasksCompleted, { title: '', priority: 'Medium' }]);
  };

  const removeCompletedTask = (index: number) => {
    if (tasksCompleted.length > 1) {
      setTasksCompleted(tasksCompleted.filter((_, i) => i !== index));
    }
  };

  const updateCompletedTask = (index: number, field: keyof Task, value: any) => {
    const updated = [...tasksCompleted];
    updated[index] = { ...updated[index], [field]: value };
    setTasksCompleted(updated);
  };

  const addWIPTask = () => {
    setWorkInProgress([...workInProgress, { title: '', priority: 'Medium' }]);
  };

  const removeWIPTask = (index: number) => {
    if (workInProgress.length > 1) {
      setWorkInProgress(workInProgress.filter((_, i) => i !== index));
    }
  };

  const updateWIPTask = (index: number, field: keyof Task, value: any) => {
    const updated = [...workInProgress];
    updated[index] = { ...updated[index], [field]: value };
    setWorkInProgress(updated);
  };

  const addChallenge = () => {
    setChallenges([...challenges, { description: '', solution: '' }]);
  };

  const removeChallenge = (index: number) => {
    if (challenges.length > 1) {
      setChallenges(challenges.filter((_, i) => i !== index));
    }
  };

  const updateChallenge = (index: number, field: keyof Challenge, value: string) => {
    const updated = [...challenges];
    updated[index] = { ...updated[index], [field]: value };
    setChallenges(updated);
  };

  // ===== PROGRESS CALCULATION =====
  const calculateProgress = () => {
    let completed = 0;
    let total = 6; // Number of main sections
    
    if (tasksCompleted.some(t => t.title.trim() !== '')) completed++;
    if (workInProgress.some(t => t.title.trim() !== '')) completed++;
    if (challenges.some(c => c.description.trim() !== '')) completed++;
    if (improvements.trim()) completed++;
    if (nextWeekPlan.trim()) completed++;
    if (summary.trim()) completed++;
    
    return Math.round((completed / total) * 100);
  };

  // ===== SUBMIT FUNCTIONS =====
  const handleSubmit = async (status: 'draft' | 'submitted') => {
    setLoading(true);

    try {
      // Filter out empty items
      const filteredTasks = tasksCompleted.filter(t => t.title.trim() !== '');
      const filteredWIP = workInProgress.filter(t => t.title.trim() !== '');
      const filteredChallenges = challenges.filter(c => c.description.trim() !== '');

      // Validation for submission
      if (status === 'submitted') {
        if (filteredTasks.length === 0) {
          toast.error('Please add at least one completed task');
          setLoading(false);
          return;
        }
        
        if (!summary.trim()) {
          toast.error('Please add a summary');
          setLoading(false);
          return;
        }
      }

      // Validate dates are not in the future for submission
      const today = new Date();
      const endDate = new Date(weekEndDate);
      if (status === 'submitted' && endDate > today) {
        const confirmed = window.confirm(
          `You're submitting a report for a future date (${formatDate(weekEndDate)}). Continue?`
        );
        if (!confirmed) {
          setLoading(false);
          return;
        }
      }

      const endpoint = isEditingDraft ? `/api/reports/${editId}` : '/api/reports';
      const method = isEditingDraft ? 'PUT' : 'POST';

      // console.log(' Submitting to:', endpoint);
      // console.log(' Method:', method);

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStartDate,
          weekEndDate,
          tasksCompleted: filteredTasks,
          workInProgress: filteredWIP,
          challenges: filteredChallenges,
          improvements,
          nextWeekPlan,
          summary,
          status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log(' API Success! Data:', data);
        
        if (status === 'draft') {
          if (isEditingDraft) {
            console.log('🔄 Updating existing draft...');
            toast.success('Draft updated successfully!', {
              duration: 2000,
              position: 'top-right'
            });
          } else {
            console.log('💾 Saving new draft...');
            toast.success('Report saved as draft!', {
              duration: 2000,
              position: 'top-right'
            });
          }
          
          // Show draft saved modal with options
          console.log('📋 Report ID from API:', data.report?._id);
          
          if (data.report?._id) {
            // Wait a moment then show the modal
            setTimeout(() => {
              console.log('🪟 Showing draft saved modal...');
              showDraftSavedModal(data.report._id);
            }, 500);
          } else {
            console.error('❌ No report ID in response!', data);
            toast.error('Saved but could not get report ID');
          }
          
        } else {
          toast.success('Report submitted successfully!');
          router.push(`/reports/${data.report._id}`);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save report');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // const showDraftSavedModal = (reportId: string) => {
  //   console.log('🪟 Creating draft modal with ID:', reportId);
    
  //   // Create a more visible modal
  //   const modalId = toast.custom(
  //     (t) => (
  //       <div 
  //         className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-2 border-blue-300 dark:border-blue-700 max-w-md w-full transform transition-all duration-300 ${
  //           t.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
  //         }`}
  //         style={{
  //           boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  //           zIndex: 99999
  //         }}
  //       >
  //         <div className="flex items-center justify-between mb-6">
  //           <div className="flex items-center gap-3">
  //             <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
  //               <Save className="text-blue-600 dark:text-blue-400" size={26} />
  //             </div>
  //             <div>
  //               <h3 className="font-bold text-gray-900 dark:text-white text-xl">🎉 Draft Saved!</h3>
  //               <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
  //                 Your work is safe. Choose next action:
  //               </p>
  //             </div>
  //           </div>
  //           <button
  //             onClick={() => toast.dismiss(t.id)}
  //             className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
  //           >
  //             <X size={20} />
  //           </button>
  //         </div>
          
  //         <div className="space-y-3">
  //           <button
  //             onClick={() => {
  //               console.log('📝 Continuing editing...');
  //               toast.dismiss(t.id);
  //               router.push(`/reports/create?edit=${reportId}`);
  //             }}
  //             className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/20 rounded-xl transition-all duration-200 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 group"
  //           >
  //             <div className="flex items-center gap-3">
  //               <Edit size={20} className="text-blue-600 dark:text-blue-400" />
  //               <div className="text-left">
  //                 <div className="font-semibold text-blue-700 dark:text-blue-300">Continue Editing</div>
  //                 <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Make more changes</div>
  //               </div>
  //             </div>
  //             <ChevronRight size={18} className="text-blue-500" />
  //           </button>
            
  //           <button
  //             onClick={() => {
  //               console.log('👁️ Previewing draft...');
  //               toast.dismiss(t.id);
  //               router.push(`/reports/${reportId}`);
  //             }}
  //             className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/20 rounded-xl transition-all duration-200 border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 group"
  //           >
  //             <div className="flex items-center gap-3">
  //               <Eye size={20} className="text-green-600 dark:text-green-400" />
  //               <div className="text-left">
  //                 <div className="font-semibold text-green-700 dark:text-green-300">Preview Draft</div>
  //                 <div className="text-xs text-green-600/70 dark:text-green-400/70">View how it looks</div>
  //               </div>
  //             </div>
  //             <ChevronRight size={18} className="text-green-500" />
  //           </button>
            
  //           <button
  //             onClick={() => {
  //               console.log('📚 Viewing all drafts...');
  //               toast.dismiss(t.id);
  //               router.push('/reports?status=draft');
  //             }}
  //             className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600/50 rounded-xl transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group"
  //           >
  //             <div className="flex items-center gap-3">
  //               <Clock size={20} className="text-gray-600 dark:text-gray-400" />
  //               <div className="text-left">
  //                 <div className="font-semibold text-gray-700 dark:text-gray-300">View All Drafts</div>
  //                 <div className="text-xs text-gray-600/70 dark:text-gray-400/70">See all saved drafts</div>
  //               </div>
  //             </div>
  //             <ChevronRight size={18} className="text-gray-500" />
  //           </button>
  //         </div>
          
  //         <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
  //           <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
  //             ⏰ Drafts auto-save. You can return anytime.
  //           </p>
  //         </div>
  //       </div>
  //     ),
  //     {
  //       duration: 15000, // 15 seconds
  //       position: 'top-right',
  //       id: `draft-modal-${Date.now()}`,
  //     }
  //   );
    
  //   console.log('✅ Modal created with ID:', modalId);
  //   return modalId;
  // };
const showDraftSavedModal = (reportId: string) => {
  console.log('🪟 Creating draft modal with ID:', reportId);
  
  // First, dismiss any existing toasts
  toast.dismiss();
  
  // Create a very visible modal
  const modalId = toast.custom(
    (t) => (
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-4 border-blue-400 dark:border-blue-600 max-w-md w-full"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          zIndex: 99999,
          position: 'fixed' as const,
          top: '20px',
          right: '20px',
          opacity: 1,
          visibility: 'visible',
          transform: 'translateY(0)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
              <Save className="text-blue-600 dark:text-blue-400" size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-xl">🎉 Draft Saved!</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Your work is safe. Choose next action:
              </p>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => {
              console.log('📝 Continuing editing...');
              toast.dismiss(t.id);
              router.push(`/reports/create?edit=${reportId}`);
            }}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/20 rounded-xl transition-all duration-200 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 group"
          >
            <div className="flex items-center gap-3">
              <Edit size={20} className="text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <div className="font-semibold text-blue-700 dark:text-blue-300">Continue Editing</div>
                <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Make more changes</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-blue-500" />
          </button>
          
          <button
            onClick={() => {
              console.log('👁️ Previewing draft...');
              toast.dismiss(t.id);
              router.push(`/reports/${reportId}`);
            }}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/20 rounded-xl transition-all duration-200 border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 group"
          >
            <div className="flex items-center gap-3">
              <Eye size={20} className="text-green-600 dark:text-green-400" />
              <div className="text-left">
                <div className="font-semibold text-green-700 dark:text-green-300">Preview Draft</div>
                <div className="text-xs text-green-600/70 dark:text-green-400/70">View how it looks</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-green-500" />
          </button>
          
          <button
            onClick={() => {
              console.log('📚 Viewing all drafts...');
              toast.dismiss(t.id);
              router.push('/reports?status=draft');
            }}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600/50 rounded-xl transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 group"
          >
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-gray-600 dark:text-gray-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-700 dark:text-gray-300">View All Drafts</div>
                <div className="text-xs text-gray-600/70 dark:text-gray-400/70">See all saved drafts</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            ⏰ Drafts auto-save. You can return anytime.
          </p>
        </div>
      </div>
    ),
    {
      duration: 15000, // 15 seconds
      position: 'top-right',
      id: `draft-modal-${Date.now()}`,
    }
  );
  
  console.log('✅ Modal created with ID:', modalId);
  return modalId;
};
  const deleteDraft = async () => {
    if (!isEditingDraft || !editId) return;
    
    if (!confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/reports/${editId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Draft deleted successfully');
        router.push('/reports/create');
      } else {
        toast.error('Failed to delete draft');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  const progressPercentage = calculateProgress();

  if (loading && isEditingDraft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading draft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="mb-10 md:mb-12 lg:mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-3 md:mb-4">
                {isEditingDraft ? '✏️ Edit Draft Report' : '📝 Create Weekly Report'}
              </h1>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
                {isEditingDraft 
                  ? 'Continue editing your draft. Save as draft to return later, or submit when ready.'
                  : 'Fill out your accomplishments, challenges, and plans for any week'
                }
              </p>
            </div>
            
            {isEditingDraft && (
              <button
                onClick={deleteDraft}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span className="hidden sm:inline">Delete Draft</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Draft Progress Bar */}
          {isEditingDraft && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-100 dark:border-blue-800/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                  <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">Draft Progress</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Complete the report to submit
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {progressPercentage}%
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Started: {originalReport?.createdAt ? formatDate(originalReport.createdAt) : 'Recently'}</span>
                <span>Complete {progressPercentage}%</span>
              </div>
            </div>
          )}

          {/* Week Navigation (only show when not editing draft) */}
          {!isEditingDraft && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 md:p-6 rounded-xl border-2 border-purple-100 dark:border-purple-700/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    <Calendar className="inline-block mr-2" size={24} />
                    Select Report Week
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create reports for past, present, or future weeks
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={goToPreviousWeek}
                    className="p-2 md:p-3 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                    title="Previous week"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button
                    onClick={goToCurrentWeek}
                    className="px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium shadow-sm"
                  >
                    Current Week
                  </button>
                  
                  <button
                    onClick={goToNextWeek}
                    className="p-2 md:p-3 bg-white dark:bg-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                    title="Next week"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              
              {/* Week Info Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 border-2 border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm font-semibold">
                        {getWeekLabel()}
                      </span>
                      {weekOffset !== 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({weekOffset > 0 ? '+' : ''}{weekOffset} weeks)
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {formatDate(weekStartDate)} → {formatDate(weekEndDate)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Saturday to Thursday ({weekOffset === 0 ? 'this week' : weekOffset < 0 ? 'past week' : 'future week'})
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Week Range</div>
                    <div className="text-base font-mono text-gray-900 dark:text-white">
                      {weekStartDate} to {weekEndDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 md:p-8 lg:p-10 space-y-8 md:space-y-10 lg:space-y-12">
          
          {/* ===== WEEK DATES INPUTS ===== */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-5">
              📅 {isEditingDraft ? 'Report Dates' : 'Custom Date Range'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 md:mb-3">
                  Week Start (Saturday) *
                </label>
                <input
                  type="date"
                  value={weekStartDate}
                  onChange={(e) => setWeekStartDate(e.target.value)}
                  className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={isEditingDraft}
                />
                {isEditingDraft && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dates cannot be changed for existing drafts
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 md:mb-3">
                  Week End (Thursday) *
                </label>
                <input
                  type="date"
                  value={weekEndDate}
                  onChange={(e) => setWeekEndDate(e.target.value)}
                  className="w-full px-4 md:px-5 py-3 md:py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={isEditingDraft}
                />
              </div>
            </div>
            
            {/* Quick date buttons (only when not editing draft) */}
            {!isEditingDraft && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => {
                    const dates = getWeekDates(-1);
                    setWeekStartDate(dates.start);
                    setWeekEndDate(dates.end);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  Last Week
                </button>
                <button
                  onClick={() => {
                    const dates = getWeekDates(-2);
                    setWeekStartDate(dates.start);
                    setWeekEndDate(dates.end);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  2 Weeks Ago
                </button>
                <button
                  onClick={() => {
                    const dates = getWeekDates(-4);
                    setWeekStartDate(dates.start);
                    setWeekEndDate(dates.end);
                  }}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
                >
                  Last Month
                </button>
              </div>
            )}
          </div>

          {/* ===== TASKS COMPLETED ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <div className="flex justify-between items-center mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                <CheckCircle className="inline-block mr-2" size={24} />
                Tasks Completed ({formatDate(weekStartDate).split(',')[0]} - {formatDate(weekEndDate).split(',')[0]})
              </h2>
              <span className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full font-medium">
                {tasksCompleted.filter(t => t.title.trim() !== '').length} tasks
              </span>
            </div>
            <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
              {tasksCompleted.map((task, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 md:p-6 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-600 transition-all">
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateCompletedTask(index, 'title', e.target.value)}
                        placeholder="What did you complete during this week?"
                        className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <input
                          type="number"
                          value={task.timeSpent || ''}
                          onChange={(e) => updateCompletedTask(index, 'timeSpent', Number(e.target.value))}
                          placeholder="Hours spent"
                          className="px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <select
                          value={task.priority}
                          onChange={(e) => updateCompletedTask(index, 'priority', e.target.value)}
                          className="px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                        </select>
                      </div>
                    </div>
                    {tasksCompleted.length > 1 && (
                      <button
                        onClick={() => removeCompletedTask(index)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 md:p-3 rounded-lg h-fit transition-all"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addCompletedTask}
              className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold text-base md:text-lg transition-all"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {/* ===== WORK IN PROGRESS ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <div className="flex justify-between items-center mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                <TrendingUp className="inline-block mr-2" size={24} />
                Work in Progress
              </h2>
              <span className="text-sm px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 rounded-full font-medium">
                {workInProgress.filter(t => t.title.trim() !== '').length} tasks
              </span>
            </div>
            <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
              {workInProgress.map((task, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 md:p-6 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600 transition-all">
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateWIPTask(index, 'title', e.target.value)}
                        placeholder="What are you working on?"
                        className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <input
                          type="number"
                          value={task.timeSpent || ''}
                          onChange={(e) => updateWIPTask(index, 'timeSpent', Number(e.target.value))}
                          placeholder="Hours spent"
                          className="px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <select
                          value={task.priority}
                          onChange={(e) => updateWIPTask(index, 'priority', e.target.value)}
                          className="px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                        </select>
                      </div>
                    </div>
                    {workInProgress.length > 1 && (
                      <button
                        onClick={() => removeWIPTask(index)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 md:p-3 rounded-lg h-fit transition-all"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addWIPTask}
              className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold text-base md:text-lg transition-all"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {/* ===== CHALLENGES ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <div className="flex justify-between items-center mb-5 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                <AlertCircle className="inline-block mr-2" size={24} />
                Challenges Faced
              </h2>
              <span className="text-sm px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full font-medium">
                {challenges.filter(c => c.description.trim() !== '').length} challenges
              </span>
            </div>
            <div className="space-y-3 md:space-y-4 mb-5 md:mb-6">
              {challenges.map((challenge, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 md:p-6 rounded-xl border-2 border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-600 transition-all">
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-1 space-y-3 md:space-y-4">
                      <textarea
                        value={challenge.description}
                        onChange={(e) => updateChallenge(index, 'description', e.target.value)}
                        placeholder="Describe the challenge..."
                        rows={3}
                        className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <textarea
                        value={challenge.solution}
                        onChange={(e) => updateChallenge(index, 'solution', e.target.value)}
                        placeholder="How did you solve it? (optional)"
                        rows={3}
                        className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    {challenges.length > 1 && (
                      <button
                        onClick={() => removeChallenge(index)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 md:p-3 rounded-lg h-fit transition-all"
                      >
                        <X size={22} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addChallenge}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-base md:text-lg transition-all"
            >
              <Plus size={20} />
              Add Challenge
            </button>
          </div>

          {/* ===== IMPROVEMENTS ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 md:mb-6">
              <Target className="inline-block mr-2" size={24} />
              Improvements & Learnings
            </h2>
            <textarea
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="What did you learn? What improvements did you make?"
              rows={5}
              className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* ===== NEXT WEEK PLAN ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 md:mb-6">
              <CalendarDays className="inline-block mr-2" size={24} />
              Next Week's Plan
            </h2>
            <textarea
              value={nextWeekPlan}
              onChange={(e) => setNextWeekPlan(e.target.value)}
              placeholder="What are your goals and plans for next week?"
              rows={5}
              className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* ===== SUMMARY ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 md:mb-6">
              <FileText className="inline-block mr-2" size={24} />
              Overall Summary
            </h2>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Summarize your week in a few sentences..."
              rows={4}
              className="w-full px-4 md:px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* ===== ACTION BUTTONS ===== */}
          <div className="border-t-2 border-gray-100 dark:border-gray-700 pt-8 md:pt-10">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 md:p-6 rounded-xl mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                📋 Report Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">Week</div>
                  <div className="font-semibold">{formatDate(weekStartDate)}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">Completed Tasks</div>
                  <div className="font-semibold">{tasksCompleted.filter(t => t.title.trim() !== '').length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">Progress</div>
                  <div className="font-semibold text-purple-600 dark:text-purple-400">
                    {progressPercentage}% Complete
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              {/* Save as Draft Button */}
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl md:rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex-1 group"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>{isEditingDraft ? 'Update Draft' : 'Save as Draft'}</span>
                    <Clock size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
              
              {/* Submit Button */}
              <button
                onClick={() => handleSubmit('submitted')}
                disabled={loading || progressPercentage < 50}
                className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl md:rounded-2xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold flex-1 group relative overflow-hidden"
              >
                {progressPercentage < 50 && (
                  <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center z-20">
                    <span className="text-xs font-semibold">Complete 50% to submit</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Send size={20} className="relative z-10" />
                <span className="relative z-10">
                  {isEditingDraft ? 'Submit Report' : 'Submit Now'}
                </span>
              </button>
            </div>
            
            {/* Helper Text */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Save as Draft:</strong> Save progress and return later to complete
                <br />
                <strong>Submit Now:</strong> Finalize and submit report for review
              </p>
              {isEditingDraft && originalReport && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Draft last saved: {originalReport.updatedAt 
                    ? formatDate(originalReport.updatedAt) 
                    : formatDate(originalReport.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

// Main wrapper component with Suspense boundary
export default function CreateReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading report editor...</p>
        </div>
      </div>
    }>
      <CreateReportContent />
    </Suspense>
  );
}