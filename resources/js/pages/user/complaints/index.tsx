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
import { createComplaint, viewComplaint, dashboard, userComplaints } from '@/routes';
import { router, Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Clock, MessageSquare, PlusCircle, Trash2 } from 'lucide-react';
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
        title: 'Keluhan Saya',
        href: userComplaints(),
    },
];

interface Category {
    id: number;
    name: string;
}

interface Comment {
    id: number;
    user_id: number;
    comment: string;
    created_at: string;
}

interface Complaint {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'resolved';
    created_at: string;
    category: Category;
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
    };
}

export default function ComplaintsIndex({
    complaints,
    categories,
    filters,
}: ComplaintsIndexProps) {
    const handleCategoryChange = (value: string) => {
        router.get(
            '/user/complaints',
            { category_id: value === 'all' ? null : value },
            { preserveState: true },
        );
    };

    const handleDeleteComplaint = (id: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus keluhan ini? Tindakan ini tidak dapat dibatalkan.',
            )
        ) {
            router.delete(`/user/complaints/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keluhan Saya" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Keluhan Saya
                        </h2>
                        <Button onClick={() => router.visit(createComplaint())}>
                            <PlusCircle className="h-4 w-4" />
                            Ajukan Keluhan
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
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
                    </div>

                    {complaints.data.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10">
                                <div className="rounded-full bg-muted p-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    Belum Ada Keluhan
                                </h3>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    Anda belum mengajukan keluhan. Klik tombol "Ajukan Keluhan" untuk membuat keluhan baru.
                                </p>
                                <Button
                                    className="mt-4"
                                    onClick={() => router.visit(createComplaint())}
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Ajukan Keluhan
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {complaints.data.map((complaint) => (
                                <Card key={complaint.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {complaint.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    Kategori:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {complaint.category.name}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    Diajukan pada:{' '}
                                                    <span className="font-medium text-foreground">
                                                        {format(
                                                            new Date(
                                                                complaint.created_at,
                                                            ),
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
                                            {complaint.comments.length
                                                ? `${complaint.comments.length} komentar`
                                                : 'Belum ada komentar'}
                                        </div>
                                        <div className="flex space-x-2">
                                            {complaint.status === 'pending' && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteComplaint(
                                                            complaint.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    Hapus
                                                </Button>
                                            )}
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    router.visit(viewComplaint(complaint.id))
                                                }
                                            >
                                                Lihat Detail
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
