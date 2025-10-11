import { FileText, Image } from 'lucide-react';
import { getMediaArray, normalizeMedia, getSecureMediaUrl } from '@/lib/media-utils';

interface MediaAttachmentsProps {
    media: any;
    className?: string;
    size?: 'sm' | 'md';
}

export function MediaAttachments({ media, className = '', size = 'md' }: MediaAttachmentsProps) {
    const mediaArray = getMediaArray(media);

    if (mediaArray.length === 0) return null;

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1'
    };

    const iconSizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4'
    };

    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {mediaArray.map((mediaItem, index) => {
                const normalizedMedia = normalizeMedia(mediaItem);
                return (
                    <a
                        key={index}
                        href={getSecureMediaUrl(normalizedMedia.path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 rounded-md border bg-muted hover:bg-muted/80 transition-colors ${sizeClasses[size]}`}
                    >
                        {normalizedMedia.type.includes('image') ? (
                            <Image className={iconSizeClasses[size]} />
                        ) : (
                            <FileText className={iconSizeClasses[size]} />
                        )}
                        Attachment {index + 1}
                    </a>
                );
            })}
        </div>
    );
}
