"use client"
import React, { useEffect } from 'react';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function Header() {


    const path = usePathname();
    useEffect(() => {
        console.log(path)

    }, [])

    return (
        <header className="flex items-center justify-between p-4 bg-gray-50 shadow-md">
            <Image src="/logo.svg" width={160} height={100} alt="Company Logo" />

            <nav>
                <ul className="hidden md:flex space-x-4">
                    <li className={` hover:text-blue-500 cursor-pointer hover:font-bold ${path=='/dashboard' &&'text-primary font-bold'}`} >DashboardLayout</li>
                    <li className={` hover:text-blue-500 cursor-pointer hover:font-bold ${path == '/dashboard//questions' && 'text-primary font-bold'}`}>Questions</li>
                    <li className={` hover:text-blue-500 cursor-pointer hover:font-bold ${path == '/dashboard/upgrade' && 'text-primary font-bold'}`}>Upgrade</li>
                    <li className={` hover:text-blue-500 cursor-pointer hover:font-bold ${path == '/dashboard/how' && 'text-primary font-bold'}`}>How it Works?</li>
                </ul>
            </nav>

            <UserButton />
        </header>
    );
}

export default Header;
