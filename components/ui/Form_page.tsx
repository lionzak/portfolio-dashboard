import React, { useState, useEffect } from 'react';
import { Mail, User, MessageSquare, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/format_date';
import { getInitials } from '@/utils/get_avatar_initials';

interface Submission {
    name: string;
    email: string;
    message: string;
    id: number;
    submissionDate: string;
    submissionDateISO: string;
}

interface Pagination {
    count: number;
    currentPage: number;
    total: number;
    firstPage: number;
    lastPage: number;
    size: number;
}

interface ApiResponse {
    success: boolean;
    data: {
        id: string;
        submissions: Submission[];
        pagination: Pagination;
    };
}

const SubmissionsDashboard: React.FC = () => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (page: number = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/getform?page=${page}`);

            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }

            const json: ApiResponse = await response.json();
            setData(json);
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, []);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && data?.data.pagination && newPage <= data.data.pagination.lastPage) {
            fetchData(newPage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data?.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full">
                    <div className="text-red-500 text-xl mb-2">Error</div>
                    <div className="text-gray-600 mb-4">{error || 'Failed to load submissions'}</div>
                    <button
                        onClick={() => fetchData(currentPage)}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { submissions, pagination } = data.data;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                                Submissions Dashboard
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
                                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Form ID:</p>
                                <span className="font-mono text-xs sm:text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded break-all hidden sm:inline">
                                    {data.data.id}
                                </span>
                            </div>
                        </div>
                        <div className="bg-blue-50 px-3 sm:px-4 py-2 rounded-lg flex-shrink-0 hidden sm:flex">
                            <span className="text-blue-800 font-semibold text-sm sm:text-base">
                                {pagination.total} Total Submissions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-8 h-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
                        <div className="flex items-center">
                            <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                            <div className="ml-3 sm:ml-4 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                                    {pagination.total}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border">
                        <div className="flex items-center">
                            <User className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 flex-shrink-0" />
                            <div className="ml-3 sm:ml-4 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Page</p>
                                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                                    {pagination.currentPage}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
                            <div className="ml-3 sm:ml-4 min-w-0">
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Per Page</p>
                                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                                    {pagination.size}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions List - This should now scroll properly */}
                <div className="bg-white rounded-lg shadow-sm border flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex-shrink-0">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Submissions</h2>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: '400px' }}>
                        {data.data.submissions.length !== 0 ? (
                            <div className="divide-y divide-gray-200">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0 self-center sm:self-start">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                                                    {getInitials(submission.name)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0 min-w-0">
                                                        <h3 className="text-base sm:text-lg font-medium text-gray-900 capitalize truncate">
                                                            {submission.name}
                                                        </h3>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                                            ID: {submission.id}
                                                        </span>
                                                    </div>
                                                    <time className="text-xs sm:text-sm text-gray-500 flex items-center flex-shrink-0">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                        <span className="hidden sm:inline">
                                                            {formatDate(submission.submissionDateISO)}
                                                        </span>
                                                        <span className="sm:hidden">
                                                            {formatDate(submission.submissionDateISO).split(' ')[0]}
                                                        </span>
                                                    </time>
                                                </div>

                                                <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
                                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                                                    <span className="truncate">{submission.email}</span>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-start">
                                                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                                                            {submission.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <h1 className='text-lg sm:text-2xl text-gray-500'>No submissions yet</h1>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination - Keep it fixed at bottom */}
                {pagination.lastPage > 1 && (
                    <div className="mt-4 sm:mt-8 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                                <div className="block sm:inline">
                                    Showing page {pagination.currentPage} of {pagination.lastPage}
                                </div>
                                <span className="block sm:inline sm:ml-2 text-gray-500">
                                    ({((pagination.currentPage - 1) * pagination.size) + 1}-{Math.min(pagination.currentPage * pagination.size, pagination.total)} of {pagination.total})
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === pagination.firstPage}
                                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                                    <span className="hidden sm:inline">Previous</span>
                                </button>

                                {/* Page numbers - Show fewer on mobile */}
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5, pagination.lastPage) }, (_, i) => {
                                        const maxPages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5;
                                        let pageNum;
                                        if (pagination.lastPage <= maxPages) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= Math.ceil(maxPages / 2)) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.lastPage - Math.floor(maxPages / 2)) {
                                            pageNum = pagination.lastPage - maxPages + 1 + i;
                                        } else {
                                            pageNum = pagination.currentPage - Math.floor(maxPages / 2) + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${pageNum === pagination.currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionsDashboard;