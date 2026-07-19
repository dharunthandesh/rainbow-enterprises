import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Rainbow Enterprises',
  description: 'Secure administrative portal for Rainbow Enterprises.',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
