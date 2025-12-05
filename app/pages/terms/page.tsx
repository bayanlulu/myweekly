'use client';

import Link from 'next/link';
import { Shield, FileText, AlertCircle, Scale } from 'lucide-react';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <div className="min-h-screen gradient-light px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl mb-6 shadow-lg mx-auto">
              <Scale className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple rules for using MyWeekly. Please read them carefully.
            </p>
          </div>

          {/* Important Notice */}
          <div className="card mb-8">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Important</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  By using MyWeekly, you agree to these terms. If you don't agree, please don't use the service.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="card">
            <div className="space-y-8">
              
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <FileText className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    By accessing or using MyWeekly ("the Service"), you agree to be bound by these 
                    Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    MyWeekly is a web application that helps users create, manage, and track 
                    weekly reports. The Service includes features for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creating and editing weekly reports</li>
                    <li>Saving drafts and templates</li>
                    <li>Exporting reports in various formats</li>
                    <li>Tracking progress over time</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    To use MyWeekly, you must create an account. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintaining the confidentiality of your account and password</li>
                    <li>All activities that occur under your account</li>
                    <li>Ensuring your account information is accurate and current</li>
                  </ul>
                  <p>
                    You must notify us immediately of any unauthorized use of your account.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. User Content</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    You retain ownership of all content you create using MyWeekly ("User Content"). 
                    By using the Service, you grant us a limited license to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Store your User Content on our servers</li>
                    <li>Display your User Content to you and those you choose to share with</li>
                    <li>Backup and protect your User Content</li>
                  </ul>
                  <p>
                    You are solely responsible for your User Content and the consequences of posting or publishing it.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Acceptable Use</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    You agree not to use the Service:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>For any illegal purpose or in violation of any laws</li>
                    <li>To harass, abuse, or harm others</li>
                    <li>To interfere with or disrupt the Service</li>
                    <li>To attempt to gain unauthorized access to the Service</li>
                    <li>To upload viruses or malicious code</li>
                    <li>To spam or send unsolicited messages</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Service Modifications</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We reserve the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Modify or discontinue the Service with or without notice</li>
                    <li>Change pricing if we introduce paid features (with advance notice)</li>
                    <li>Limit storage or features if necessary</li>
                  </ul>
                  <p>
                    We shall not be liable to you or any third party for any modification, 
                    suspension, or discontinuance of the Service.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Disclaimer of Warranties</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    The Service is provided "as is" and "as available" without any warranties of any kind, 
                    either express or implied. We do not warrant that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The Service will be uninterrupted or error-free</li>
                    <li>The Service will meet your specific requirements</li>
                    <li>The results from using the Service will be accurate or reliable</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Limitation of Liability</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    To the maximum extent permitted by law, we shall not be liable for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                    <li>Damages resulting from your use or inability to use the Service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Termination</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We may terminate or suspend your account immediately, without prior notice or liability, 
                    for any reason, including if you breach these Terms.
                  </p>
                  <p>
                    Upon termination, your right to use the Service will immediately cease. You can also 
                    terminate your account at any time by deleting it in the app settings.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Changes to Terms</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    We reserve the right to modify these terms at any time. We will provide notice of 
                    significant changes by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Posting the new terms on this page</li>
                    <li>Sending an email to registered users (for major changes)</li>
                    <li>Showing a notice in the application</li>
                  </ul>
                  <p>
                    Your continued use of the Service after any changes constitutes acceptance of those changes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Governing Law</h2>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of 
                    Palestine, without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12. Contact Information</h2>
                </div>
                <div className="space-y-3 text-gray-700 dark:text-gray-300">
                  <p>
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p>
                    <strong>Email:</strong> bayanazzam4@gmail.com
                  </p>
                  <p>
                    <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </section>

            </div>

            {/* Acceptance Note */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                By using MyWeekly, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
            </div>

            {/* Navigation */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/pages/privacy"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                >
                  ← Privacy Policy
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