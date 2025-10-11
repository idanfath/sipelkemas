interface StatusBadgeProps {
    status: 'pending' | 'in_progress' | 'resolved';
    className?: string;
}

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

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(status)} ${className}`}>
            {getStatusText(status)}
        </div>
    );
}
