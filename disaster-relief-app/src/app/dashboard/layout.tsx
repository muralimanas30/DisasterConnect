'use client';

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';
import { UserState } from '@/types/userTypes';
import Navbar from '@/components/Navbar';
import NavLink from '@/components/NavLink';

interface RootState {
    user: UserState;
}

interface LayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
    const user = useSelector((store: RootState) => store.user);
    const router = useRouter();
    const pathname = usePathname(); // Get the current route

    useEffect(() => {
        if (!user?.token) {
            router.push('/auth/login');
        }
    }, [user?.token, router]);

    if (!user?.token) return null;

    // Generate breadcrumbs based on the current route
    const generateBreadcrumbs = () => {
        const segments = pathname ? pathname.split('/').filter(Boolean) : []; // Split the path into segments
        const breadcrumbs = segments.map((segment, index) => {
            const path = '/' + segments.slice(0, index + 1).join('/');
            const name = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize the segment
            return { name, path };
        });
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <div className="min-h-screen bg-base-200">
            {/* Navbar */}
            <Navbar />
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs p-4">
                <ul>
                    <li>
                        <NavLink href="/">Home</NavLink>
                    </li>
                    {breadcrumbs.map((breadcrumb, index) => (
                        <li key={index}>
                            <NavLink href={breadcrumb.path}>{breadcrumb.name}</NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Page Content */}
            <main className="p-6">{children}</main>
        </div>
    );
}