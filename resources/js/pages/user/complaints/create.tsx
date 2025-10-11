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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { userComplaints, dashboard, createComplaint } from '@/routes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { router, Head } from '@inertiajs/react';
import { useState } from 'react';
import { Loader2, PlusCircle, X } from 'lucide-react';
import { Category } from '@/types';
import { type BreadcrumbItem } from '@/types';

const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Judul harus memiliki minimal 2 karakter',
    }),
    description: z.string().min(10, {
        message: 'Deskripsi harus memiliki minimal 10 karakter',
    }),
    category_id: z.string().nonempty('Silakan pilih kategori keluhan'),
    is_anonymous: z.boolean().default(false),
    media: z.array(z.any()).optional(),
});

export default function CreateComplaint({ categories }: { categories: Category[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            category_id: '',
            is_anonymous: false,
            media: [],
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);

        // Create FormData object for file uploads
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category_id', values.category_id);
        formData.append('is_anonymous', values.is_anonymous ? '1' : '0');

        // Add files to FormData
        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file, index) => {
                formData.append(`media[${index}]`, file);
            });
        }

        router.post('/complaints', formData, {
            onFinish: () => setIsSubmitting(false),
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        setUploadedFiles((prev) => [...prev, ...files]);
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Ajukan Keluhan', href: '/user/complaints/create' },
        ]}>
            <div className="p-4">
                <div className="flex items-center mb-4 justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Ajukan Keluhan
                    </h2>
                    <Button onClick={() => router.visit(userComplaints())}>
                        Kembali ke Daftar
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Form Pengajuan Keluhan</CardTitle>
                        <CardDescription>
                            Silakan isi formulir di bawah untuk mengajukan keluhan baru.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Judul Keluhan</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Masukkan judul keluhan"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Berikan judul yang singkat dan jelas.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategori</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih kategori keluhan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category: Category) => (
                                                        <SelectItem
                                                            key={category.id}
                                                            value={String(category.id)}
                                                        >
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Pilih kategori yang paling sesuai dengan keluhan Anda.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deskripsi</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Jelaskan keluhan Anda secara detail"
                                                    className="min-h-32"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Berikan penjelasan detail tentang keluhan Anda.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="is_anonymous"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Ajukan Secara Anonim
                                                </FormLabel>
                                                <FormDescription>
                                                    Identitas Anda tidak akan ditampilkan jika opsi ini diaktifkan.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <FormLabel>Lampiran (Opsional)</FormLabel>
                                    <div className="mt-2">
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                    <FormDescription>
                                        Unggah bukti pendukung berupa gambar atau dokumen (maks. 5MB per file)
                                    </FormDescription>

                                    {uploadedFiles.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm font-medium">File yang diunggah:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {uploadedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 rounded-md border bg-muted px-3 py-1"
                                                    >
                                                        <span className="text-sm">
                                                            {file.name}
                                                        </span>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-5 w-5"
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Ajukan Keluhan
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
