import { ReactNode } from 'react';
import { Sidebar } from './_components/sidebar';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="container flex gap-5 pt-8 pb-24">
      <Sidebar />
      {children}
    </div>
  );
}
