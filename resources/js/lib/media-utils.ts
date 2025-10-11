import { Media } from '@/types';

// Helper function to normalize media data
export function normalizeMedia(media: any): Media {
    if (typeof media === 'string') {
        // Old format: just a string path
        return {
            path: media,
            type: media.toLowerCase().includes('.jpg') ||
                media.toLowerCase().includes('.jpeg') ||
                media.toLowerCase().includes('.png') ||
                media.toLowerCase().includes('.gif') ||
                media.toLowerCase().includes('.webp') ? 'image' : 'file'
        };
    }
    // New format: object with path and type
    return media;
}

// Helper function to get media array from various formats
export function getMediaArray(media: any): Media[] {
    if (!media) return [];

    // If it's already an array, return it
    if (Array.isArray(media)) return media;

    // If it's a string (JSON), try to parse it
    if (typeof media === 'string') {
        try {
            const parsed = JSON.parse(media);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    return [];
}

// Helper function to generate secure media URL
export function getSecureMediaUrl(mediaPath: string): string {
    if (mediaPath.startsWith('complaint_media/')) {
        const filename = mediaPath.replace('complaint_media/', '');
        return `/secure/complaint-media/${filename}`;
    } else if (mediaPath.startsWith('comment_media/')) {
        const filename = mediaPath.replace('comment_media/', '');
        return `/secure/comment-media/${filename}`;
    }
    return mediaPath;
}
