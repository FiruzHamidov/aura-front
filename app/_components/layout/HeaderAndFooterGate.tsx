'use client';
import type { ReactNode } from 'react';

declare global {
  interface Window {
    BX24?: unknown;
  }
}

type Props = { children: ReactNode };

export default function HeaderAndFooterGate({ children }: Props) {
  const isIframe =
    typeof window !== 'undefined' && window.self !== window.top;
  const isBxEmbed =
    typeof window !== 'undefined' && Boolean(window.BX24);

  const isEmbed = isIframe || isBxEmbed;

  return isEmbed ? null : <>{children}</>;
}