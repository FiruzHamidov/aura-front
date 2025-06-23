'use client';

import { FormEvent, useState } from 'react';
import { useMask } from '@react-input/mask';
import Logo from '@/icons/Logo';
import {
  useSendSmsMutation,
  useVerifySmsMutation,
  useLoginMutation,
} from '@/services/login/hooks';
import { AuthMode } from '@/services/login/types';

export default function Login() {
  const [mode, setMode] = useState<AuthMode>('sms');
  const [phone, setPhone] = useState('93 808 08 88');
  const [password, setPassword] = useState('password123');
  const [code, setCode] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [error, setError] = useState('');

  const sendSmsMutation = useSendSmsMutation();
  const verifySmsMutation = useVerifySmsMutation();
  const loginMutation = useLoginMutation();

  const inputRef = useMask({
    mask: '__ ___ __ __',
    replacement: { _: /\d/ },
  });

  const handleSendSms = async () => {
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      await sendSmsMutation.mutateAsync({ phone: cleanPhone });
      setSmsSent(true);
      // eslint-disable-next-line
    } catch (err) {
      setError('Ошибка отправки SMS');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');

    try {
      if (mode === 'sms') {
        await verifySmsMutation.mutateAsync({ phone: cleanPhone, code });
      } else {
        await loginMutation.mutateAsync({ phone: cleanPhone, password });
      }
      // eslint-disable-next-line
    } catch (err) {
      setError('Ошибка авторизации');
    }
  };

  const resetSmsFlow = () => {
    setSmsSent(false);
    setCode('');
    setError('');
  };

  return (
    <div className="flex items-center justify-center py-9">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 relative flex flex-col items-center">
        <div className="mt-5 mb-8">
          <Logo className="w-[200px] h-[44px]" />
        </div>

        <h1 className="text-[28px] font-bold text-center mb-6">
          Вход в личный кабинет
        </h1>

        <div className="bg-[#F0F2F5] rounded-full w-max px-3 py-2.5 flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('sms');
              resetSmsFlow();
            }}
            className={`px-6 py-2 rounded-full cursor-pointer font-medium transition-all duration-150 ease-in-out ${
              mode === 'sms'
                ? 'bg-white text-[#0036A5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            SMS
          </button>
          <button
            onClick={() => {
              setMode('password');
              resetSmsFlow();
            }}
            className={`px-6 py-2 rounded-full cursor-pointer font-medium transition-all duration-150 ease-in-out ${
              mode === 'password'
                ? 'bg-white text-[#0036A5]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Пароль
          </button>
        </div>

        {mode === 'sms' && (
          <>
            {!smsSent ? (
              <div className="w-full">
                <div className="mb-5">
                  <input
                    ref={inputRef}
                    type="tel"
                    placeholder="XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                    required
                  />
                </div>
                <button
                  onClick={handleSendSms}
                  disabled={
                    sendSmsMutation.isPending ||
                    phone.replace(/\D/g, '').length < 9
                  }
                  className="w-full bg-[#0036A5] hover:bg-[#002D72] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer disabled:opacity-50 mb-5"
                >
                  {sendSmsMutation.isPending
                    ? 'Отправляем...'
                    : 'Отправить код'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Код отправлен на номер</p>
                  <p className="text-gray-600 mb-4">{phone}</p>
                  <button
                    type="button"
                    onClick={resetSmsFlow}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Изменить номер
                  </button>
                </div>

                <div className="mb-5">
                  <input
                    type="text"
                    placeholder="Код из SMS"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifySmsMutation.isPending}
                  className="w-full bg-[#0036A5] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer disabled:opacity-50 mb-5"
                >
                  {verifySmsMutation.isPending ? 'Проверяем...' : 'Подтвердить'}
                </button>

                <div className="text-center text-gray-500 text-sm">
                  Отправить код заново через 00:30
                </div>
              </form>
            )}
          </>
        )}

        {/* Password Mode */}
        {mode === 'password' && (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <input
                ref={inputRef}
                type="tel"
                placeholder="XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                required
              />
            </div>

            <div className="mb-5">
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border border-[#BAC0CC] rounded-xl text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0036A5]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#0036A5] hover:bg-[#002D72] text-white py-5 rounded-lg text-lg transition-colors cursor-pointer disabled:opacity-50 mb-5"
            >
              {loginMutation.isPending ? 'Входим...' : 'Войти'}
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-center font-medium">
            {error}
          </div>
        )}

        <button className="mt-auto pt-20 text-[#666F8D] hover:text-gray-700 text-lg">
          Помощь
        </button>
      </div>
    </div>
  );
}
