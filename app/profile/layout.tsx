import { ReactNode } from 'react';
import { Sidebar } from './_components/sidebar';

export default function ProfileLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 flex gap-5 pt-8 pb-24">
      <Sidebar />
      {children}
    </div>
  );
}
