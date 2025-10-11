import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Complaint {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string;
    };
}

interface ReportsProps {
    complaints: {
        data: Complaint[];
        links: any;
        total: number;
        per_page: number;
        current_page: number;
    };
    categories: Category[];
    filters: {
        start_date?: string;
        end_date?: string;
        category_id?: string;
        status?: string;
    };
}

export default function Reports({ complaints, categories, filters }: ReportsProps) {
    const [filterValues, setFilterValues] = useState({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        category_id: filters.category_id || '',
        status: filters.status || '',
    });

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFilterValues(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function applyFilters() {
        router.get('/admin/complaints', filterValues, {
            preserveState: true,
        });
    }

    function resetFilters() {
        const emptyFilters = {
            start_date: '',
            end_date: '',
            category_id: '',
            status: '',
        };

        setFilterValues(emptyFilters);
        router.get('/admin/complaints', emptyFilters, {
            preserveState: true,
        });
    }

    function exportToCSV() {
        // Create a CSV content
        const headers = ['ID', 'Title', 'Category', 'Status', 'Submitted By', 'Date'];

        const csvContent = [
            headers.join(','),
            ...complaints.data.map(complaint => [
                complaint.id,
                `"${complaint.title.replace(/"/g, '""')}"`, // Escape quotes
                `"${complaint.category.name.replace(/"/g, '""')}"`,
                complaint.status,
                `"${complaint.user.name.replace(/"/g, '""')}"`,
                format(new Date(complaint.created_at), 'yyyy-MM-dd')
            ].join(','))
        ].join('\n');

        // Create and trigger a download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.setAttribute('href', url);
        link.setAttribute('download', `complaints-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function getStatusBadgeClass(status: string) {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'resolved':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    function formatStatus(status: string) {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'in_progress':
                return 'In Progress';
            case 'resolved':
                return 'Resolved';
            default:
                return status;
        }
    }

    return (
        <AppLayout>
            <Head title="Complaints Reports" />

            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Complaints Reports</h1>
                    <Button
                        onClick={exportToCSV}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Export to CSV
                    </Button>
                </div>

                <div className="py-4">
                    <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Options
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="start_date">
                                Start Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={filterValues.start_date}
                                    onChange={handleFilterChange}
                                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="end_date">
                                End Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={filterValues.end_date}
                                    onChange={handleFilterChange}
                                    className="pl-10 pr-4 py-2 w-full border rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="category_id">
                                Category
                            </label>
                            <select
                                id="category_id"
                                name="category_id"
                                value={filterValues.category_id}
                                onChange={handleFilterChange}
                                className="px-4 py-2 w-full border rounded-md"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={filterValues.status}
                                onChange={handleFilterChange}
                                className="px-4 py-2 w-full border rounded-md"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                        <Button
                            type="button"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Status</th>
                                    <th className="px-4 py-3 text-left">Submitted By</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {complaints.data.map((complaint) => (
                                    <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                        <td className="px-4 py-3 whitespace-nowrap">{complaint.id}</td>
                                        <td className="px-4 py-3 max-w-xs truncate" title={complaint.title}>
                                            {complaint.title}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">{complaint.category.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(complaint.status)}`}>
                                                {formatStatus(complaint.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">{complaint.user.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {format(new Date(complaint.created_at), 'yyyy-MM-dd')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {complaints.data.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            No complaints found.
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="px-4 py-3 flex items-center justify-between border-t">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium">{complaints.data.length}</span> of <span className="font-medium">{complaints.total}</span> complaints
                        </div>
                        {complaints.links && complaints.links.length > 3 && (
                            <div className="flex gap-1">
                                {complaints.links.map((link: any, i: number) => {
                                    // Skip first and last items if they are "prev/next" links and not needed
                                    if ((i === 0 && link.label.includes('Previous') && link.url === null) ||
                                        (i === complaints.links.length - 1 && link.label.includes('Next') && link.url === null)) {
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1 rounded text-sm ${link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url === null
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
