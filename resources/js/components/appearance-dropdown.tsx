import { HTMLAttributes } from 'react';
import { Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Return a simple light mode icon button (non-functional)
export default function AppearanceToggleDropdown({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={className} {...props}>
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-md cursor-default"
                disabled
            >
                <Sun className="h-5 w-5" />
                <span className="sr-only">Light mode</span>
            </Button>
        </div>
    );
}
