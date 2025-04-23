'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import { UserState } from '@/types/userTypes';

interface RootState {
    user: UserState;
}

interface LayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
    const user = useSelector((store: RootState) => store.user);
    const router = useRouter();

    useEffect(() => {
        if (user?.token) {
            return router.push('/dashboard/home');
        }
    }, [user?.token, router]);
    return (
        <>
        {children}
        </>
        
    );
}
