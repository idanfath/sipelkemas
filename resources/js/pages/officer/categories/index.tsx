import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, X, FolderOpen } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Kategori Yang Dikelola',
        href: '/officer/categories',
    },
];

interface Category {
    id: number;
    name: string;
    description: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface CategoriesIndexProps {
    categories: Category[];
}

export default function OfficerCategoryIndex({ categories }: CategoriesIndexProps) {
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [editValues, setEditValues] = useState({
        name: '',
        description: '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    function startEdit(category: Category) {
        setEditingCategory(category.id);
        setEditValues({
            name: category.name,
            description: category.description || '',
        });
        setErrors({});
    }

    function cancelEdit() {
        setEditingCategory(null);
        setEditValues({ name: '', description: '' });
        setErrors({});
    }

    function handleSubmit(categoryId: number) {
        setProcessing(true);
        setErrors({});

        router.patch(`/officer/categories/${categoryId}`, editValues, {
            onSuccess: () => {
                setEditingCategory(null);
                setEditValues({ name: '', description: '' });
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setEditValues(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kategori Yang Dikelola" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Kategori Yang Dikelola
                        </h2>
                    </div>

                    {categories.length === 0 ? (
                        <Card>
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="rounded-full bg-muted p-4">
                                    <FolderOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-medium">
                                    Tidak Ada Kategori
                                </h3>
                                <p className="mt-2 text-center text-sm text-muted-foreground">
                                    Anda belum ditugaskan untuk mengelola kategori apapun.
                                    Hubungi admin untuk mendapatkan penugasan kategori.
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {categories.map((category) => (
                                <Card key={category.id} className="overflow-hidden">
                                    <div className="p-6">
                                        {editingCategory === category.id ? (
                                            /* Edit Mode */
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Nama Kategori
                                                    </label>
                                                    <Input
                                                        name="name"
                                                        value={editValues.name}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan nama kategori"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.name}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">
                                                        Deskripsi
                                                    </label>
                                                    <Textarea
                                                        name="description"
                                                        value={editValues.description}
                                                        onChange={handleChange}
                                                        placeholder="Masukkan deskripsi kategori (opsional)"
                                                        rows={3}
                                                        className={errors.description ? 'border-red-500' : ''}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-sm text-red-500">
                                                            {errors.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={cancelEdit}
                                                        disabled={processing}
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleSubmit(category.id)}
                                                        disabled={processing || !editValues.name.trim()}
                                                    >
                                                        <Save className="h-4 w-4 mr-1" />
                                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* View Mode */
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-semibold">
                                                            {category.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {category.description || (
                                                                <span className="italic">
                                                                    Tidak ada deskripsi
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => startEdit(category)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium text-muted-foreground">
                                                            Dibuat pada:
                                                        </span>
                                                        <p>
                                                            {new Date(category.created_at).toLocaleDateString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-muted-foreground">
                                                            Terakhir diperbarui:
                                                        </span>
                                                        <p>
                                                            {new Date(category.updated_at).toLocaleDateString('id-ID', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t">
                                                    <p className="text-xs text-muted-foreground">
                                                        Anda bertanggung jawab untuk menangani semua keluhan yang masuk dalam kategori ini.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {categories.length > 0 && (
                        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                            <div className="p-4">
                                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Informasi Pengelolaan Kategori
                                </h4>
                                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <li>• Anda dapat mengedit nama dan deskripsi kategori yang ditugaskan kepada Anda</li>
                                    <li>• Semua keluhan yang masuk dalam kategori ini akan diteruskan kepada Anda</li>
                                    <li>• Hubungi admin jika perlu bantuan atau ingin mengajukan kategori baru</li>
                                </ul>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
