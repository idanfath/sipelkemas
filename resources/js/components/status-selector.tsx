import { Loader2, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface StatusSelectorProps {
    currentStatus: 'pending' | 'in_progress' | 'resolved';
    onStatusChange: (status: 'pending' | 'in_progress' | 'resolved') => void;
    isUpdating?: boolean;
    disabled?: boolean;
}

export function StatusSelector({
    currentStatus,
    onStatusChange,
    isUpdating = false,
    disabled = false
}: StatusSelectorProps) {
    return (
        <div className="flex items-center space-x-2">
            <Select
                value={currentStatus}
                onValueChange={onStatusChange}
                disabled={isUpdating || disabled}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ubah Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span>Menunggu</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                        <div className="flex items-center space-x-2">
                            <PlayCircle className="h-4 w-4 text-blue-600" />
                            <span>Diproses</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="resolved">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Selesai</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
            {isUpdating && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
        </div>
    );
}
