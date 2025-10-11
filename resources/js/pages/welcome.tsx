import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WelcomePageProps {
    stats: {
        totalComplaints: number;
        resolvedComplaints: number;
        pendingComplaints: number;
        inProgressComplaints: number;
        totalStudents: number;
        totalOfficers: number;
        totalCategories: number;
        satisfactionRate: number;
        recentComplaints: Array<{
            id: number;
            title: string;
            category: string;
            status: string;
            is_anonymous: boolean;
            created_at: string;
        }>;
        categoriesWithCounts: Array<{
            name: string;
            count: number;
        }>;
    };
}

export default function Welcome() {
    const { auth, stats } = usePage<SharedData & WelcomePageProps>().props;

    const features = [
        {
            title: 'Mudah Digunakan',
            description: 'Interface yang sederhana dan intuitif untuk semua mahasiswa',
            icon: '🎯'
        },
        {
            title: 'Respon Cepat',
            description: 'Sistem notifikasi real-time untuk update status keluhan Anda',
            icon: '⚡'
        },
        {
            title: 'Anonim & Transparan',
            description: 'Pilihan untuk mengajukan keluhan secara anonim dengan tracking yang transparan',
            icon: '👁️'
        },
        {
            title: 'Multi Kategori',
            description: 'Berbagai kategori keluhan dengan officer yang berpengalaman',
            icon: '🗂️'
        }
    ];

    const displayStats = [
        { number: stats?.totalComplaints?.toLocaleString() || '0', label: 'Total Keluhan' },
        { number: `${stats?.satisfactionRate || 0}%`, label: 'Tingkat Penyelesaian' },
        { number: stats?.totalCategories?.toLocaleString() || '0', label: 'Kategori Tersedia' },
        { number: stats?.totalOfficers?.toLocaleString() || '0', label: 'Officer Siap Membantu' }
    ];

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'pending': { text: 'Menunggu', variant: 'secondary' as const },
            'in_progress': { text: 'Diproses', variant: 'default' as const },
            'resolved': { text: 'Selesai', variant: 'default' as const }
        };
        return statusMap[status as keyof typeof statusMap] || { text: status, variant: 'secondary' as const };
    };

    return (
        <>
            <Head title="Welcome - Sipelkemas">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Navigation */}
                <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <AppLogo />
                            </div>
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Button asChild variant="default" size="sm">
                                        <Link href={dashboard()}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={login()}>
                                                Masuk
                                            </Link>
                                        </Button>
                                        <Button asChild variant="default" size="sm">
                                            <Link href={register()}>
                                                Daftar
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20 lg:py-32">
                    <div className="container mx-auto px-4 text-center">
                        <div className="mx-auto max-w-4xl">
                            <Badge variant="secondary" className="mb-6 px-4 py-2">
                                🎓 Platform Keluhan Mahasiswa Terpercaya
                            </Badge>
                            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
                                Sistem Pelayanan{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    Keluhan Mahasiswa
                                </span>
                            </h1>
                            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                                Platform digital untuk mahasiswa menyampaikan keluhan atau masukan terkait layanan kampus.
                                Tingkatkan kualitas pelayanan kampus dengan partisipasi aktif mahasiswa.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                {!auth.user && (
                                    <>
                                        <Button asChild size="lg" className="px-8 py-6 text-lg">
                                            <Link href={register()}>
                                                Mulai Ajukan Keluhan
                                            </Link>
                                        </Button>
                                        <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                                            <Link href={login()}>
                                                Masuk ke Akun
                                            </Link>
                                        </Button>
                                    </>
                                )}
                                {auth.user && (
                                    <Button asChild size="lg" className="px-8 py-6 text-lg">
                                        <Link href={dashboard()}>
                                            Buka Dashboard
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white/50 dark:bg-gray-800/50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                            {displayStats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 lg:text-4xl">
                                        {stat.number}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recent Complaints Section */}
                {stats?.recentComplaints && stats.recentComplaints.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                    Keluhan Terbaru
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Lihat beberapa keluhan yang baru-baru ini diajukan oleh mahasiswa
                                </p>
                            </div>
                            <div className="grid gap-6 md:grid-cols-3">
                                {stats.recentComplaints.map((complaint) => (
                                    <Card key={complaint.id} className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <Badge variant={getStatusBadge(complaint.status).variant}>
                                                    {getStatusBadge(complaint.status).text}
                                                </Badge>
                                                <span className="text-xs text-gray-500">
                                                    {complaint.created_at}
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg line-clamp-2">
                                                {complaint.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    {complaint.category}
                                                </span>
                                                {complaint.is_anonymous ? (
                                                    <Badge variant="outline" className="text-xs">
                                                        Anonim
                                                    </Badge>
                                                ) : ""}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Features Section */}
                <section className="py-20 bg-white/30 dark:bg-gray-800/30">
                    <div className="container mx-auto px-4">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                                Mengapa Memilih Sipelkemas?
                            </h2>
                            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                                Platform yang dirancang khusus untuk memudahkan mahasiswa dalam menyampaikan keluhan
                                dan mendapatkan pelayanan terbaik dari kampus.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-0 bg-white/80 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                                    <CardHeader className="text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900">
                                            {feature.icon}
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-center">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                {stats?.categoriesWithCounts && stats.categoriesWithCounts.length > 0 && (
                    <section className="py-16">
                        <div className="container mx-auto px-4">
                            <div className="mb-12 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                                    Kategori Keluhan
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Berbagai kategori keluhan yang dapat ditangani oleh officer berpengalaman
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {stats.categoriesWithCounts.map((category, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg bg-white/80 p-4 shadow-sm dark:bg-gray-800/80">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {category.name}
                                        </span>
                                        <Badge variant="secondary">
                                            {category.count} keluhan
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* How it Works Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="container mx-auto px-4">
                        <div className="text-center text-white">
                            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                                Cara Kerja Sipelkemas
                            </h2>
                            <p className="mb-12 text-xl text-blue-100">
                                Proses yang sederhana dan efektif untuk menyampaikan keluhan Anda
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    step: '01',
                                    title: 'Daftar & Masuk',
                                    description: 'Buat akun mahasiswa atau masuk ke sistem untuk mulai menggunakan layanan'
                                },
                                {
                                    step: '02',
                                    title: 'Ajukan Keluhan',
                                    description: 'Pilih kategori, tulis keluhan dengan detail, dan lampirkan bukti jika diperlukan'
                                },
                                {
                                    step: '03',
                                    title: 'Pantau & Diskusi',
                                    description: 'Lacak status penanganan dan diskusi dengan officer melalui sistem komentar'
                                }
                            ].map((item, index) => (
                                <div key={index} className="text-center text-white">
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                                        {item.step}
                                    </div>
                                    <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
                                    <p className="text-blue-100">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-white py-12 dark:bg-gray-900 dark:border-gray-700">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center space-x-3">
                                <AppLogo />
                            </div>
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                © 2025 Sipelkemas. Melayani mahasiswa dengan sepenuh hati untuk kampus yang lebih baik.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
