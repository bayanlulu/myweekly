import React from 'react';
import Link from 'next/link';
import { Heart, FileText, Shield, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
  <FileText size={20} className="text-white" />
</div>

              <div>
                <h3 className="text-xl font-black">MyWeekly</h3>
                <p className="text-sm text-purple-200">Weekly Reports Made Simple</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <Link
              href="/reports"
              className="text-purple-200 hover:text-white transition text-sm px-3 py-2 hover:bg-purple-800/30 rounded-lg flex items-center gap-2"
            >
              <FileText size={14} />
              My Reports
            </Link>
            <Link
              href="/reports/create"
              className="text-purple-200 hover:text-white transition text-sm px-3 py-2 hover:bg-purple-800/30 rounded-lg flex items-center gap-2"
            >
              <FileText size={14} />
              New Report
            </Link>
            <a
              href="mailto:bayanazzam4@gmail.com"
              className="text-purple-200 hover:text-white transition text-sm px-3 py-2 hover:bg-purple-800/30 rounded-lg flex items-center gap-2"
            >
              <Mail size={14} />
              Contact
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm flex items-center justify-center gap-2">
              Made with <Heart size={14} className="text-pink-300 animate-pulse" />
              <span className="text-purple-300">© {currentYear}</span>
            </p>
            <p className="text-xs text-purple-400 mt-1">
              All rights reserved
            </p>
          </div>
        </div>

        <div className="border-t border-purple-800 my-4"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex gap-4 mb-3 md:mb-0">
            <Link
              href="/pages/privacy"
              className="text-xs text-purple-300 hover:text-white transition flex items-center gap-1"
            >
              <Shield size={12} />
              Privacy
            </Link>
            <Link
              href="/pages/terms"
              className="text-xs text-purple-300 hover:text-white transition flex items-center gap-1"
            >
              <Shield size={12} />
              Terms
            </Link>
            <Link
              href="/pages/about"
              className="text-xs text-purple-300 hover:text-white transition"
            >
              About
            </Link>
          </div>

          <div className="text-center">
            <p className="text-xs text-purple-400">
              Create weekly reports in minutes • Free forever
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;