'use client';

import { FormEvent, useState } from 'react';
import { useMask } from '@react-input/mask';
import Logo from '@/icons/Logo';
import {
  useLoginMutation,
  useVerifyCodeMutation,
} from '@/services/login/hooks';

export default function Login() {
  const [phone, setPhone] = useState('+992938080888');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const loginMutation = useLoginMutation();
  const verifyMutation = useVerifyCodeMutation();

  // Create mask for Tajikistan phone numbers: +992 XX XXX XX XX
  const inputRef = useMask({
    mask: '+992 __ ___ __ __',
    replacement: { _: /\d/ },
  });

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Remove formatting for API call - keep only digits
    const cleanPhone = phone.replace(/\D/g, '');
    const result = await loginMutation.mutateAsync({
      phone: cleanPhone,
      password: 'password123',
    });
    if (result.requires_verification) {
      setStep('code');
    }
  };

  const handleCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    verifyMutation.mutate({ phone: cleanPhone, code });
  };

  if (step === 'code') {
    return (
      <div className="flex items-center justify-center py-9">
        <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative flex flex-col items-center">
          <div className="mt-5 mb-8">
            <Logo className="w-[200px] h-[44px]" />
          </div>

          <h1 className="text-[28px] font-bold text-center mb-4">
            Подтверждение входа
          </h1>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Подтвердите номер телефона</p>
            <p className="text-gray-600 mb-2">{phone} введите код из смс</p>
            <button
              onClick={() => setStep('phone')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Изменить номер
            </button>
          </div>

          <form onSubmit={handleCodeSubmit} className="w-full">
            <div className="mb-5 w-full">
              <input
                type="text"
                placeholder="Код из смс"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full bg-[#0036A5] hover:bg-[#002D72] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer disabled:opacity-50 mb-5"
            >
              {verifyMutation.isPending ? 'Проверяем...' : 'Продолжить'}
            </button>
          </form>

          <div className="text-center text-gray-500 text-sm mb-8">
            Отправить код заново через 00:30
          </div>

          {verifyMutation.isError && (
            <div className="mt-4 text-red-600 text-center">Неверный код</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-9">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative flex flex-col items-center">
        <div className="mt-5 mb-8">
          <Logo className="w-[200px] h-[44px]" />
        </div>

        <h1 className="text-[28px] font-bold text-center mb-9">
          Вход в личный кабинет
        </h1>

        <form onSubmit={handlePhoneSubmit} className="w-full">
          <div className="mb-5 w-full">
            <input
              ref={inputRef}
              type="tel"
              placeholder="+992 XX XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              loginMutation.isPending || phone.replace(/\D/g, '').length < 12
            }
            className="w-full bg-[#0036A5] hover:bg-[#002D72] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer disabled:opacity-50 mb-5"
          >
            {loginMutation.isPending ? 'Отправляем...' : 'Получить код'}
          </button>
        </form>

        <button className="w-full py-5 bg-[#EFF6FF] hover:bg-[#E0E0E0] text-[#0036A5] rounded-xl text-lg transition-colors cursor-pointer mb-auto">
          Другим способом
        </button>

        {loginMutation.isError && (
          <div className="mt-4 text-red-600 text-center">
            Ошибка отправки кода
          </div>
        )}

        <button className="mt-auto pt-20 text-[#666F8D] hover:text-gray-700 text-lg">
          Помощь
        </button>
      </div>
    </div>
  );
}
