import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { router, Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Clock, MessageSquare, Eye, AlertCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

function getStatusBadgeClass(status: string) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'in_progress':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'resolved':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
}

function getStatusText(status: string) {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'in_progress':
            return 'Diproses';
        case 'resolved':
            return 'Selesai';
        default:
            return 'Unknown';
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Keluhan Yang Ditangani',
        href: '/officer/complaints',
    },
];

interface Category {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    created_at: string;
    user?: User;
}

interface Complaint {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    is_anonymous: boolean;
    created_at: string;
    category: Category;
    user: User;
    comments: Comment[];
}

interface ComplaintsIndexProps {
    complaints: {
        data: Complaint[];
        links: any;
    };
    categories: Category[];
    filters: {
        category_id?: string | null;
        status?: string | null;
    };
}

export default function OfficerComplaintsIndex({
    complaints,
    categories,
    filters,
}: ComplaintsIndexProps) {
    const handleCategoryChange = (value: string) => {
        router.get(
            '/officer/complaints',
            {
                category_id: value === 'all' ? null : value,
                status: filters.status
            },
            { preserveState: true },
        );
    };

    const handleStatusChange = (value: string) => {
        router.get(
            '/officer/complaints',
            {
                category_id: filters.category_id,
                status: value === 'all' ? null : value
            },
            { preserveState: true },
        );
    };

    const getLatestCommentUser = (comments: Comment[]) => {
        if (comments.length === 0) return null;
        const latestComment = comments[comments.length - 1];
        return latestComment.user || null;
    };

    const needsResponse = (complaint: Complaint) => {
        if (complaint.comments.length === 0) return true;
        const latestComment = complaint.comments[complaint.comments.length - 1];
        // Compare user IDs directly if user object is not available
        const latestCommentUserId = latestComment.user?.id || latestComment.user_id;
        return latestCommentUserId === complaint.user.id;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keluhan Yang Ditangani" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Keluhan Yang Ditangani
                        </h2>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Filter kategori:</span>
                            <Select
                                value={filters.category_id || 'all'}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Semua kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua kategori
                                    </SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm">Status:</span>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Menunggu
                                    </SelectItem>
                                    <SelectItem value="in_progress">
                                        Diproses
                                    </SelectItem>
                                    <SelectItem value="resolved">
                                        Selesai
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {complaints.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <div className="rounded-full bg-muted p-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    Tidak Ada Keluhan
                                </h3>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    Belum ada keluhan yang perlu ditangani untuk kategori yang Anda kelola.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {complaints.data.map((complaint) => (
                                <Card key={complaint.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CardTitle className="text-lg">
                                                        {complaint.title}
                                                    </CardTitle>
                                                    {needsResponse(complaint) && complaint.status !== 'resolved' && (
                                                        <div className="flex items-center text-red-600">
                                                            <AlertCircle className="h-4 w-4" />
                                                            <span className="text-xs ml-1">Perlu respon</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <CardDescription className="mt-1">
                                                    Kategori:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {complaint.category.name}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    Pelapor:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {complaint.is_anonymous ? 'Anonim' : complaint.user.name}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    Dilaporkan pada:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {format(
                                                            new Date(complaint.created_at),
                                                            'dd MMM yyyy',
                                                        )}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                            <div className="flex space-x-2">
                                                <div
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                        complaint.status,
                                                    )}`}
                                                >
                                                    {getStatusText(complaint.status)}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-3 pt-0">
                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                            {complaint.description}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock className="mr-1 h-4 w-4" />
                                            {complaint.comments.length > 0
                                                ? `${complaint.comments.length} komentar`
                                                : 'Belum ada komentar'}
                                            {complaint.comments.length > 0 && (
                                                <>
                                                    <span className="mx-2">•</span>
                                                    Komentar terakhir dari:{' '}
                                                    <span className="font-medium">
                                                        {getLatestCommentUser(complaint.comments)?.name || 'Unknown'}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(`/complaints/${complaint.id}`)
                                                }
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                Lihat & Tanggapi
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {complaints.links && complaints.data.length > 0 && (
                        <div className="flex items-center justify-center space-x-2">
                            {complaints.links.map((link: any, i: number) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.visit(link.url)
                                    }
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
