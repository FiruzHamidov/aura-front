'use client';

import { FC, FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

type PersonalRealtorCtaProps = {
  title?: string;        // заголовок, который попадёт в ТГ
  requestType?: string;  // тип обращения, попадёт в ТГ
};

const PersonalRealtorCta: FC<PersonalRealtorCtaProps> = ({
                                                           title = 'Заявка: личный риелтор',
                                                           requestType = 'personal_realtor',
                                                         }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (raw: string) => {
    const t = raw.trim();
    if (!t) return 'Укажите номер телефона';
    const digits = t.replace(/[^\d+]/g, '');
    if (!/^\+?\d{7,15}$/.test(digits)) return 'Неверный формат телефона';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const err = validate(phone);
    if (err) {
      setError(err);
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const payload = {
      phone: phone.trim(),
      requestType,
      title,
      pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      const res = await fetch('/api/telegram/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.ok) {
        console.error(json.error);
        toast.error('Не удалось отправить заявку. Попробуйте ещё раз.', { position: 'top-center' });
        return;
      }

      setPhone('');
      toast.success('Спасибо! Мы скоро свяжемся с вами.', { position: 'top-center' });
    } catch (e) {
      console.error(e);
      toast.error('Ошибка сети. Попробуйте позже.', { position: 'top-center' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const base =
      'w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-white/70 focus:ring-2 focus:ring-white/80 outline-none transition duration-200';
  const inputClass = `${base} ${error ? 'border-red-400' : 'border-white'} focus:border-white/80`;

  return (
      <section className="container">
        <div className="mt-10 md:mt-20 relative bg-blue-800 rounded-3xl overflow-hidden">
          <Image
              src="/images/personal-cta/img.png"
              alt="Hand holding house keys"
              fill
              className="opacity-50 md:opacity-100"
              quality={85}
              priority
          />

          <div className="relative z-10 pt-4 md:pt-16 md:pb-12 px-4 py-5 md:pl-[66px] text-white md:max-w-[710px]">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              «Личный риелтор» – ваш проводник в мире недвижимости!
            </h2>
            <div className="md:text-[22px] font-normal mb-[22px] md:max-w-[500px]">
              Подберём лучший вариант, проведём сделку и сэкономим ваше время!
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-[360px]" noValidate>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Введите номер телефона
                </label>
                <input
                    ref={inputRef}
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="+992 9XX XXX XXX"
                    required
                    aria-invalid={!!error}
                    aria-describedby={error ? 'phone-error' : undefined}
                    className={inputClass}
                />
                {error && (
                    <p id="phone-error" className="mt-1 text-sm text-red-200">
                      {error}
                    </p>
                )}
              </div>

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer bg-white text-[#1E3A8A] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 focus:outline-none transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Отправка…' : 'Свяжитесь со мной'}
              </button>
            </form>

            <p className="text-xs mt-4 max-w-[310px]">
              Нажимая на кнопку «Свяжитесь со мной», я даю согласие на обработку персональных данных.
            </p>
          </div>
        </div>
      </section>
  );
};

export default PersonalRealtorCta;