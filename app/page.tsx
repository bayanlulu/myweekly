'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle, ArrowRight, Play, X } from 'lucide-react';
import Footer from '@/components/Footer';

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center sm:justify-start gap-3">
      <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
      <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm sm:text-base">{text}</span>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-xl sm:text-2xl md:text-3xl font-black text-gradient">{value}</p>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

// Video Modal Component
function VideoModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            MyWeekly App Demo
          </h3>
          <button
            onClick={onClose}
            aria-label="Close demo video"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>
        <video
          className="w-full rounded-lg"
          controls
          autoPlay
          muted
        >
          <source src="/videos/demo.mp4" type="video/mp4" />
          Your browser doesn't support the video tag.
        </video>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center gradient-light px-4 py-8 sm:py-12">
        <div className="card max-w-4xl w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 sm:mb-6 shadow-lg mx-auto">
            <Sparkles className="text-white" size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">
            Fast. Simple. Stay on Track.         </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-xl mx-auto">
            Keep your work organized and your week on track—without the hassle.          </p>
          <div className="space-y-3 mb-6 sm:mb-8 max-w-md mx-auto">
            <Feature text="No Credit Card Required" />
            <Feature text="Free Forever" />
            <Feature text="Setup in 30 Seconds" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
            <Link
              href="/register"
              className="btn btn-primary flex items-center justify-center gap-2 text-sm sm:text-base">
              Start Free Today
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="btn btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base">
              Login
            </Link>
          </div>

          {/* Demo Video Preview */}
          <div className="my-6 sm:my-8">
            <div
              className="relative rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-700 cursor-pointer group shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setShowVideo(true)}
            >
              <div className="relative aspect-video">
                <img
                  src="/images/demo.1.png"
                  alt="MyWeekly app dashboard preview showing weekly planning interface"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-2xl">
                    <Play className="w-8 h-8 text-purple-600 ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg">
                  Watch Demo
                </div>
              </div>
            </div>
          </div>

          {/* Video Modal */}
          <VideoModal show={showVideo} onClose={() => setShowVideo(false)} />

          <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-800">
            <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base">
              "This app cut my weekly reporting time from 30 minutes to 5. Game changer for me!"
            </p>
            <p className="text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              — Bayan Lulu
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <StatCard value="100%" label="Free Forever" />
            <StatCard value="5min" label="Per Report" />
            <StatCard value="30s" label="Setup Time" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
