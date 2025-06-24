'use client';

import { FC, FormEvent } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const PersonalRealtorCta: FC = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phone = formData.get('phone');
    console.log('Form submitted with phone:', phone);

    toast.success(`Спасибо! Мы свяжемся с вами по номеру: ${phone}`, {
      position: 'top-center',
    });
  };

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
            Личный риелтор» – ваш проводник в мире недвижимости!
          </h2>
          <div className="md:text-[22px] font-normal mb-[22px] md:max-w-[500px]">
            Подберём лучший вариант, проведём сделку и сэкономим ваше время!
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 max-w-[360px]">
            <div>
              <label htmlFor="phone" className="sr-only">
                Введите номер телефона
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Введите номер телефона"
                required
                className="w-full bg-transparent border border-white rounded-lg px-4 py-3 text-white placeholder-white/70 focus:ring-2 focus:ring-white/80 focus:border-white/80 outline-none transition duration-200"
              />
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-white text-[#1E3A8A] font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 focus:outline-none transition duration-200"
            >
              Свяжитесь со мной
            </button>
          </form>

          <p className="text-xs mt-4 max-w-[310px]">
            Нажимая на кнопку «Свяжитесь со мной», я даю согласие на обработку
            персональных данных.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PersonalRealtorCta;
