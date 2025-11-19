'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Jangan gunakan padding untuk halaman login dan register
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  if (isAuthPage) {
    return <main>{children}</main>;
  }
  
  return (
    <main className="lg:pl-64 pt-16 lg:pt-0">
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-8 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
}
