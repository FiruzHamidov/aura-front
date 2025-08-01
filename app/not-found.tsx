'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="container py-40 text-center">
      <h1 className="text-3xl uppercase font-semibold mb-6">
        Страница не найдена (later will be implemented)
      </h1>
      <button
        onClick={() => router.push('/')}
        className="bg-[#0036A5] cursor-pointer text-white px-10 py-5 rounded-2xl text-2xl"
      >
        Вернуться на главную
      </button>
    </div>
  );
}
