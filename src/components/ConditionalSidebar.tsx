'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ConditionalSidebar() {
  const pathname = usePathname();
  
  // Jangan tampilkan sidebar di halaman login dan register
  const hideNavigation = pathname === '/login' || pathname === '/register';
  
  if (hideNavigation) {
    return null;
  }
  
  return <Sidebar />;
}
