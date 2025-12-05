'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Target, 
  Heart, 
  Zap, 
  Shield, 
  ArrowRight,
  FileText,
  Clock,
  Infinity,
  CheckCircle
} from 'lucide-react';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen gradient-light px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg mx-auto">
              <Sparkles className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              About MyWeekly
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The simple, beautiful way to track your weekly progress and achievements.
            </p>
          </div>

          {/* Our Story */}
          <div className="card mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Target className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Story</h2>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                MyWeekly started from a simple frustration: weekly reports were taking too long to write, 
                often feeling like a chore rather than a useful reflection.
              </p>
              <p>
                As a developer, I found myself spending 30+ minutes every Friday trying to remember 
                what I accomplished during the week. The process was tedious, repetitive, and didn't 
                provide much value beyond ticking a box.
              </p>
              <p>
                So I built MyWeekly—a tool that makes weekly reporting simple, fast, and actually 
                helpful. What started as a personal script has grown into a full application that 
                helps others stay organized and productive.
              </p>
              <p className="italic text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                — Bayan
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Target className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Mission</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                To make weekly reporting so simple that it becomes a productive habit, 
                not a burdensome task. I believe that consistent reflection leads to 
                meaningful growth and better results.
              </p>
            </div>

            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Zap className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">My Vision</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                To be the go-to tool for professionals who want to track their progress, 
                celebrate achievements, and plan effectively—all in one beautiful, 
                intuitive interface.
              </p>
            </div>
          </div>

          {/* My Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              What I Believe In
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Simplicity</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  I believe tools should make life easier. No unnecessary features, no complexity.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Privacy</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Your data is yours. I don't track you, sell your information, or show ads.
                </p>
              </div>

              <div className="card text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Care</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Built with attention to detail and genuine care for users' experience.
                </p>
              </div>
            </div>
          </div>

          {/* What Makes It Different */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Why I Built MyWeekly
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">For People Like Me</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Built by someone who actually needs weekly reports, for people who need them.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Fast & Efficient</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Create reports in 5 minutes instead of 30. My streamlined interface saves you time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Draft Management</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Save work in progress, return later, and never lose your thoughts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Export Options</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Download your reports as PDF or share them with your team.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Free Forever</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    No subscriptions, no credit cards, no limits. I believe in accessible productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
              Simple Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Free</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">5min</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Per Report</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">0</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Setup</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-gradient mb-2">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Reports</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your Productive Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join Bayan and others who have made weekly reporting a simple, valuable habit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="btn btn-primary flex items-center justify-center gap-2 px-8"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="btn btn-secondary flex items-center justify-center gap-2 px-8"
              >
                Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}