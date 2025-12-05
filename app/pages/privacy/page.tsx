'use client';

import Link from 'next/link';
import { Shield, Lock, EyeOff, FileText, AlertCircle } from 'lucide-react';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <div className="min-h-screen gradient-light px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-6 shadow-lg mx-auto">
              <Lock className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple privacy for real people. No tracking, no ads, no nonsense.
            </p>
          </div>

          {/* Important Notice */}
          <div className="card mb-8">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl">
              <AlertCircle className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Plain Language Summary</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We don't track you. We don't sell your data. Your reports are private and belong to you. 
                  You can delete everything whenever you want.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="card">
            <div className="space-y-8">
              
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <EyeOff className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">No Tracking Policy</h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We don't use tracking cookies, analytics scripts, or any other surveillance technology. 
                    We believe your privacy matters, so we don't monitor what you do in the app.
                  </p>
                  <p>
                    We don't know which reports you create, how often you log in, or what you write. 
                    That information stays on your device and in our encrypted database.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">What We Store</h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We store only what's necessary to provide the service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your email address (for authentication)</li>
                    <li>Your weekly reports (encrypted)</li>
                    <li>Basic account preferences</li>
                  </ul>
                  <p>
                    We don't store browsing history, IP addresses (beyond basic security logs), 
                    or any other personal information.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Security</h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We use industry-standard encryption to protect your data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All data in transit is encrypted with TLS/SSL</li>
                    <li>Passwords are hashed using bcrypt</li>
                    <li>Reports are stored in encrypted databases</li>
                    <li>Regular security audits and updates</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    You have complete control over your data:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> You can view all your data in the app</li>
                    <li><strong>Export:</strong> Download your reports anytime</li>
                    <li><strong>Delete:</strong> Remove your account and all data permanently</li>
                    <li><strong>Correction:</strong> Update or correct your information</li>
                  </ul>
                  <p>
                    To delete your account, go to Settings in the app or email us at 
                    <a href="mailto:privacy@myweekly.app" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">
                      bayanazzam4@gmail.com
                    </a>
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We use a few trusted services to run MyWeekly:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Database:</strong> MongoDB Atlas (encrypted at rest)</li>
                    <li><strong>Authentication:</strong> NextAuth.js (local sessions)</li>
                    <li><strong>Hosting:</strong> Vercel (GDPR compliant)</li>
                  </ul>
                  <p>
                    These services only process data as necessary to provide their functions. 
                    They don't have independent rights to use your data.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Children's Privacy</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    MyWeekly is not intended for children under 13. We do not knowingly collect 
                    personal information from children under 13. If you are a parent or guardian 
                    and believe your child has provided us with personal information, please 
                    contact us so we can delete it.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of 
                    any changes by posting the new policy on this page and updating the 
                    "Last updated" date.
                  </p>
                  <p>
                    <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    If you have questions about this privacy policy or your data:
                  </p>
                  <p>
                    <strong>Email:</strong> bayanazzam4@gmail.com
                  </p>
                  <p>
                    We typically respond within 24 hours.
                  </p>
                </div>
              </section>

            </div>

            {/* Navigation */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/pages/terms"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Terms of Service →
                </Link>
                <Link
                  href="/pages/about"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  About Us →
                </Link>
                <Link
                  href="/"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  Back to Home →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}