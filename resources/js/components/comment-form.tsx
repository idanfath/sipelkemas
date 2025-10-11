import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PaperclipIcon, Send, Loader2, X } from 'lucide-react';
import { Comment } from '@/types';

interface CommentFormProps {
    complaintId: number;
    quotedComment?: Comment | null;
    onQuoteCancel?: () => void;
}

export function CommentForm({ complaintId, quotedComment, onQuoteCancel }: CommentFormProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const { data, setData, post, processing, reset, errors } = useForm({
        comment: '',
        quoted_comment_id: quotedComment?.id || null,
        media: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Set the form data
        setData({
            comment: data.comment,
            quoted_comment_id: quotedComment?.id || null,
            media: uploadedFiles,
        });

        post(`/complaints/${complaintId}/comments`, {
            forceFormData: true,
            onSuccess: () => {
                reset('comment');
                setUploadedFiles([]);
                onQuoteCancel?.();
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles((prev) => [...prev, ...files]);
            setData('media', [...data.media, ...files]);
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            {quotedComment && (
                <div className="relative rounded-lg border border-muted bg-muted/50 p-3 pr-10">
                    <div className="mb-1 text-xs font-medium">
                        Membalas komentar dari {quotedComment.user?.name}:
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {quotedComment.comment.length > 100
                            ? `${quotedComment.comment.substring(0, 100)}...`
                            : quotedComment.comment}
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={onQuoteCancel}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <div className="grid w-full gap-2">
                <Textarea
                    placeholder="Tulis komentar Anda di sini..."
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    className="min-h-32"
                />
                {errors.comment && (
                    <p className="text-sm text-destructive">{errors.comment}</p>
                )}
            </div>

            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium">File yang akan diunggah:</p>
                    <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-sm">
                                <span>{file.name}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => removeFile(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <input
                        type="file"
                        multiple
                        id="comment-files"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('comment-files')?.click()}
                    >
                        <PaperclipIcon className="mr-2 h-4 w-4" />
                        Lampirkan File
                    </Button>
                </div>
                <Button type="submit" disabled={processing || !data.comment}>
                    {processing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Kirim Komentar
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
