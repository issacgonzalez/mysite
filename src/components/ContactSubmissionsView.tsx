import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, User, MessageSquare, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'received' | 'email_sent' | 'email_failed';
  error?: string;
  emailId?: string;
}

export function ContactSubmissionsView({ onClose }: { onClose: () => void }) {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-928859b8/contact-submissions`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }

      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'email_sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'email_failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'email_sent':
        return 'Email Sent';
      case 'email_failed':
        return 'Email Failed';
      default:
        return 'Received';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen py-8 px-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl mx-auto bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-aurelius-gold to-aurelius-gold-light p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl text-black">Contact Submissions</h2>
                <p className="text-black/70 mt-1">
                  {submissions.length} {submissions.length === 1 ? 'message' : 'messages'} received
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-aurelius-gold border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading submissions...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-400">{error}</p>
                  <button
                    onClick={fetchSubmissions}
                    className="mt-4 px-4 py-2 bg-aurelius-gold text-black rounded-lg hover:bg-aurelius-gold-light transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No submissions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission, index) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-aurelius-gold/50 transition-colors"
                    >
                      {/* Submission Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-aurelius-gold/10 rounded-lg">
                            <User className="w-5 h-5 text-aurelius-gold" />
                          </div>
                          <div>
                            <h3 className="text-lg text-white">{submission.name}</h3>
                            <a
                              href={`mailto:${submission.email}`}
                              className="text-aurelius-gold hover:text-aurelius-gold-light text-sm flex items-center gap-1"
                            >
                              <Mail className="w-4 h-4" />
                              {submission.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(submission.status)}
                          <span className="text-sm text-gray-400">
                            {getStatusText(submission.status)}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-400">Message</span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {submission.message}
                        </p>
                      </div>

                      {/* Timestamp and Error */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(submission.timestamp).toLocaleString()}
                        </div>
                        {submission.error && (
                          <div className="text-red-400 max-w-md truncate" title={submission.error}>
                            Error: {submission.error}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="bg-gray-800 p-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 text-center mb-2">
                💡 <strong>Current Setup:</strong> Contact form is working! All messages are safely stored in your database.
              </p>
              <p className="text-xs text-gray-500 text-center">
                📧 To receive email notifications: Get a valid Resend API key from{' '}
                <a
                  href="https://resend.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aurelius-gold hover:text-aurelius-gold-light underline"
                >
                  resend.com/api-keys
                </a>{' '}
                (must start with "re_") and verify a domain at{' '}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aurelius-gold hover:text-aurelius-gold-light underline"
                >
                  resend.com/domains
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
