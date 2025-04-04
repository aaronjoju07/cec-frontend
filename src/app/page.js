'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return null; // No need to render anything as the page redirects immediately
}
