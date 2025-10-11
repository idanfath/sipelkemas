import AppLayout from '@/layouts/app-layout';
import { dashboard, userComplaints, createComplaint, officerComplaints, adminUsers, adminComplaints } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart3,
    Users,
    FilePlus,
    FileText,
    Clock,
    CheckCircle,
    MessageSquare,
    ArrowRight
} from 'lucide-react';

// Helper functions for status formatting
function getStatusBadgeClasses(status: string): string {
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

function getStatusText(status: string): string {
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
];

interface DashboardStats {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    inProgressComplaints: number;
    totalUsers?: number;
}

interface ComplaintItem {
    id: number;
    title: string;
    date: string;
    status: string;
    userName: string;
    categoryName: string;
}

interface PageProps extends SharedData {
    stats: DashboardStats;
    latestComplaints: ComplaintItem[];
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description: string;
    trend?: 'up' | 'down' | undefined;
}

function StatCard({ title, value, icon, description, trend }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="rounded-full bg-muted p-2 text-primary">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                    {trend && (
                        <span className={`ml-2 ${trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                            {trend === 'up' ? '↑' : '↓'}
                        </span>
                    )}
                </p>
            </CardContent>
        </Card>
    );
}

interface ComplaintListProps {
    complaints: ComplaintItem[];
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
    emptyDescription?: string;
}

function ComplaintList({
    complaints,
    emptyMessage = "Tidak ada keluhan terbaru",
    emptyIcon,
    emptyDescription
}: ComplaintListProps) {
    if (complaints.length === 0) {
        if (emptyIcon && emptyDescription) {
            return (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="rounded-full bg-muted p-3">
                        {emptyIcon}
                    </div>
                    <h3 className="mt-2 font-medium">{emptyMessage}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {emptyDescription}
                    </p>
                </div>
            );
        }
        return <p className="text-center text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className="space-y-3">
            {complaints.map((complaint) => (
                <div key={complaint.id} className="flex justify-between rounded-md border p-3">
                    <div>
                        <p className="font-medium">{complaint.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {complaint.date} - {complaint.categoryName}
                        </p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 h-6 py-0.5 text-xs font-medium ${getStatusBadgeClasses(complaint.status)}`}>
                        {getStatusText(complaint.status)}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Common stat cards configurations
const getStatCardsConfig = (role: string, stats: DashboardStats) => {
    const commonCards = [
        {
            title: "Sedang Diproses",
            value: stats.inProgressComplaints,
            icon: <Clock className="h-6 w-6" />,
            description: "Keluhan dalam proses"
        },
        {
            title: "Selesai",
            value: stats.resolvedComplaints,
            icon: <CheckCircle className="h-6 w-6" />,
            description: "Keluhan terselesaikan"
        }
    ];

    switch (role) {
        case 'admin':
            return [
                {
                    title: "Total Keluhan",
                    value: stats.totalComplaints,
                    icon: <BarChart3 className="h-6 w-6" />,
                    description: "Total keluhan keseluruhan"
                },
                {
                    title: "Belum Ditanggapi",
                    value: stats.pendingComplaints,
                    icon: <MessageSquare className="h-6 w-6" />,
                    description: "Keluhan yang belum ditanggapi"
                },
                ...commonCards
            ];
        case 'officer':
            return [
                {
                    title: "Belum Ditanggapi",
                    value: stats.pendingComplaints,
                    icon: <MessageSquare className="h-6 w-6" />,
                    description: "Keluhan yang belum ditanggapi"
                },
                ...commonCards
            ];
        case 'user':
        default:
            return [
                {
                    title: "Total Keluhan",
                    value: stats.totalComplaints,
                    icon: <FileText className="h-6 w-6" />,
                    description: "Keluhan yang Anda ajukan"
                },
                ...commonCards
            ];
    }
};

export default function Dashboard() {
    const { auth, stats, latestComplaints } = usePage<PageProps>().props;

    const renderDashboardContent = () => {
        switch (auth.user.role) {
            case 'admin':
                return <AdminDashboard stats={stats} latestComplaints={latestComplaints} />;
            case 'officer':
                return <OfficerDashboard stats={stats} latestComplaints={latestComplaints} />;
            case 'user':
            default:
                return <UserDashboard stats={stats} latestComplaints={latestComplaints} />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-2 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Selamat datang kembali, {auth.user.name}!
                    </p>
                </div>

                {renderDashboardContent()}
            </div>
        </AppLayout>
    );
}

interface DashboardComponentProps {
    stats: DashboardStats;
    latestComplaints: ComplaintItem[];
}

function AdminDashboard({ stats, latestComplaints }: DashboardComponentProps) {
    const statCards = getStatCardsConfig('admin', stats);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className='h-fit'>
                    <CardHeader>
                        <CardTitle>Manajemen Pengguna</CardTitle>
                        <CardDescription>
                            Kelola akun pengguna, officer dan admin
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-muted p-3">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-lg font-semibold">{stats.totalUsers || 0}</p>
                                <p className="text-sm text-muted-foreground">Pengguna terdaftar</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link href={adminUsers()}>
                                Kelola Pengguna
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Laporan Terbaru</CardTitle>
                        <CardDescription>
                            Keluhan terbaru yang masuk ke sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ComplaintList complaints={latestComplaints} />
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            <Link href={adminComplaints()}>
                                Lihat Semua Keluhan
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

function OfficerDashboard({ stats, latestComplaints }: DashboardComponentProps) {
    const statCards = getStatCardsConfig('officer', stats);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Keluhan Terbaru</CardTitle>
                    <CardDescription>
                        Keluhan terbaru yang perlu ditanggapi
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ComplaintList complaints={latestComplaints} />
                </CardContent>
                <CardFooter>
                    <Button asChild>
                        <Link href={officerComplaints()}>
                            Kelola Keluhan
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}

function UserDashboard({ stats, latestComplaints }: DashboardComponentProps) {
    const statCards = getStatCardsConfig('user', stats);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Ajukan Keluhan Baru</CardTitle>
                        <CardDescription>
                            Sampaikan keluhan atau masukan Anda terkait layanan kampus
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-4">
                            <div className="rounded-full bg-muted p-3">
                                <FilePlus className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm">
                                    Klik tombol di bawah untuk mengajukan keluhan baru.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild>
                            <Link href={createComplaint()}>
                                Ajukan Keluhan
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Keluhan Terbaru Saya</CardTitle>
                        <CardDescription>
                            Status keluhan yang telah Anda ajukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ComplaintList
                            complaints={latestComplaints}
                            emptyMessage="Belum Ada Keluhan"
                            emptyIcon={<FileText className="h-6 w-6 text-muted-foreground" />}
                            emptyDescription="Anda belum mengajukan keluhan. Klik 'Ajukan Keluhan' untuk membuat keluhan baru."
                        />
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" asChild className="w-full">
                            <Link href={userComplaints()}>
                                Lihat Semua Keluhan
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
