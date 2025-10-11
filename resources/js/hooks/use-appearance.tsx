import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

// Force light mode only
const applyTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

const setCookie = (name: string, value: string, days = 365) => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

export function initializeTheme() {
    // Force light mode
    applyTheme();
    setCookie('appearance', 'light');
    // Store in localStorage for client-side persistence
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('appearance', 'light');
    }
}

export function useAppearance() {
    // Always return light mode and a no-op update function
    return {
        appearance: 'light',
        updateAppearance: () => { }
    } as const;
}
