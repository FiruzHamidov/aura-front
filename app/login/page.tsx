'use client';

import { FormEvent, useState } from 'react';
import Logo from '@/icons/Logo';

export default function Login() {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Phone submitted:', phone);
  };

  return (
    <div className="flex items-center justify-center py-9">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative flex flex-col items-center">
        <div className="mt-5 mb-8">
          <Logo className="w-[200px] h-[44px]" />
        </div>

        <h1 className="text-[28px] font-bold text-center mb-9">
          Вход в личный кабинет
        </h1>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5 w-full">
            <input
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0036A5] hover:bg-[#002D72] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer"
          >
            Получить код
          </button>
        </form>

        <button className="mt-5 w-full py-5 bg-[#EFF6FF] hover:bg-[#E0E0E0] text-[#0036A5] rounded-xl text-lg transition-colors cursor-pointer">
          Другим способом
        </button>

        <button className="mt-auto pt-20 text-[#666F8D] hover:text-gray-700 text-lg">
          Помощь
        </button>
      </div>
    </div>
  );
}
