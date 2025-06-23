'use client'
import { useState, useEffect } from 'react';

interface Submission {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  created_at: string;
  [key: string]: any; // For any additional form fields
}

export default function SubmissionsDisplay() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async (): Promise<void> => {
    try {
      setLoading(true);
      // Replace with your actual Basin API endpoint and API key
      const response = await fetch('/api/submissions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      const data: Submission[] = await response.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error Loading Submissions</h2>
            <p>{error}</p>
            <button 
              onClick={fetchSubmissions}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Form Submissions</h1>
          <div className="flex justify-between items-center">
            <p className="text-lg text-gray-600">
              Total submissions: <span className="font-bold text-indigo-600">{submissions.length}</span>
            </p>
            <button 
              onClick={fetchSubmissions}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No submissions yet</h3>
              <p className="text-gray-600">Submissions will appear here once your form starts receiving responses.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((submission, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h3 className="text-white font-bold text-lg truncate">
                    {submission.subject || 'No Subject'}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {formatDate(submission.created_at || new Date().toISOString())}
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">From:</p>
                    <p className="text-gray-900 font-medium">{submission.name || 'Anonymous'}</p>
                    <p className="text-gray-600 text-sm">{submission.email || 'No email'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Message:</p>
                    <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">
                      {submission.message || 'No message content'}
                    </p>
                  </div>
                </div>
                
                <div className="px-6 pb-4">
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}