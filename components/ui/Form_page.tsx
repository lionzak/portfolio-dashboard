import React, { useState, useEffect } from 'react';
import { Mail, User, MessageSquare, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils/format_date';

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
            console.error('Error fetching data:', err);
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

    

    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data?.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">Error</div>
                    <div className="text-gray-600">{error || 'Failed to load submissions'}</div>
                    <button
                        onClick={() => fetchData(currentPage)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { submissions, pagination } = data.data;

    return (
        <div className="h-full bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b flex-shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Submissions Dashboard</h1>
                            <p className="text-gray-600 mt-1">Form ID: {data.data.id}</p>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-lg">   
                            <span className="text-blue-800 font-semibold">{pagination.total} Total Submissions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8 min-h-0">
                {/* Stats Cards */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 flex-shrink-0 justify-between">
                    <div className="bg-white rounded-lg shadow-sm p-6 border flex-1">
                        <div className="flex items-center">
                            <MessageSquare className="h-8 w-8 text-blue-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border flex-1">
                        <div className="flex items-center">
                            <User className="h-8 w-8 text-purple-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Page</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.currentPage}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border flex-1">
                        <div className="flex items-center">
                            <Mail className="h-8 w-8 text-orange-500" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Per Page</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.size}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submissions List - Scrollable */}
                <div className="bg-white rounded-lg shadow-sm border flex-1 flex flex-col min-h-0">
                    <div className="px-6 py-4 border-b flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Submissions</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="divide-y divide-gray-200">
                            {submissions.map((submission) => (
                                <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {getInitials(submission.name)}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-lg font-medium text-gray-900 capitalize">
                                                        {submission.name}
                                                    </h3>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ID: {submission.id}
                                                    </span>
                                                </div>
                                                <time className="text-sm text-gray-500 flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {formatDate(submission.submissionDateISO)}
                                                </time>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600 mb-3">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {submission.email}
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                    <p className="text-gray-700 text-sm leading-relaxed">
                                                        {submission.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {pagination.lastPage > 1 && (
                    <div className="mt-8 flex items-center justify-between flex-shrink-0">
                        <div className="text-sm text-gray-700">
                            Showing page {pagination.currentPage} of {pagination.lastPage}
                            <span className="ml-2 text-gray-500">
                                ({((pagination.currentPage - 1) * pagination.size) + 1}-{Math.min(pagination.currentPage * pagination.size, pagination.total)} of {pagination.total})
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === pagination.firstPage}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                                    let pageNum;
                                    if (pagination.lastPage <= 5) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (pagination.currentPage >= pagination.lastPage - 2) {
                                        pageNum = pagination.lastPage - 4 + i;
                                    } else {
                                        pageNum = pagination.currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === pagination.currentPage
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
                                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionsDashboard;