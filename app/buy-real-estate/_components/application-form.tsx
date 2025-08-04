'use client';

import Image from 'next/image';
import { useState } from 'react';

export const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requestType: '',
    message: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-gradient-to-br overflow-hidden relative z-10 from-[#0036A5] to-[#115DFB] rounded-3xl">
      <div className="flex justify-center gap-52">
        <div className="text-white w-[70%] py-[60px] px-20">
          <h2 className="text-[40px] leading-12 font-bold mb-7">
            Срочный выкуп недвижимости
          </h2>
          <p className="text-[20px] text-[#BBD2FF] leading-relaxed">
            Нужна срочная продажа? Услуга быстрого выкупа от Aura Estate — это
            надёжный и выгодный способ продать вашу недвижимость в кратчайшие
            сроки.
            <br />
            <br />
            Мы полностью берём на себя все заботы, гарантируя вам комфортную
            сделку и самые выгодные условия. Свяжитесь с нами прямо сейчас!
          </p>

          {/* Keys illustration */}
          <div className="mt-5 relative z-0 h-full opacity-45">
            <Image
              src="/images/extra-pages/keys.png"
              alt="Keys illustration"
              width={378}
              height={378}
              className="absolute object-cover"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl pt-[30px] pb-[46px] px-10 my-[35px] mr-[60px] shadow-xs relative z-10">
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-1">Форма связи онлайн</h3>
            <p className="text-[#666F8D] text-sm">
              Обратитесь к нам напрямую и с вами свяжутся наши менеджеры
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Name field */}
            <div>
              <label className="block text-sm mb-1.5">Представьтесь</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#0036A5]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Введите ваше имя"
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone field */}
            <div>
              <label className="block text-sm mb-1.5">Телефон</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#0036A5]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Введите номер телефона"
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#0036A5]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Введите email"
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Request Type field */}
            <div>
              <label className="block text-sm mb-1.5">Тип обращения</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#0036A5]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
                >
                  <option value="">Выберите</option>
                  <option value="buy">Покупка</option>
                  <option value="sell">Продажа</option>
                  <option value="rent">Аренда</option>
                  <option value="consultation">Консультация</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message field */}
            <div>
              <label className="block text-sm mb-1.5">Текст письма</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Текст письма"
                rows={4}
                className="w-full px-3 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-4 bg-[#0036A5] text-white py-[13px] rounded-lg transition-colors duration-200 hover:bg-[#002d8a]"
            >
              Отправить запрос
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
