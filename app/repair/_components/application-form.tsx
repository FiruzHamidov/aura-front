'use client';

import Image from 'next/image';
import { useState } from 'react';

export const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h2 className="text-[40px] font-bold mb-7">Ответим на все вопросы</h2>
          <p className="text-[20px] text-[#BBD2FF] leading-relaxed">
            Заполните форму, наши менеджеры свяжутся с вами и постараются быть
            максимально полезными
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

        <div className="bg-white rounded-2xl pt-[30px] pb-[46px] px-10 my-[35px] mr-[60px] shadow-xs">
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

            {/* Submit button */}
            <button
              type="submit"
              className="w-full mt-4 bg-[#0036A5] text-white py-[13px] rounded-lg transition-colors duration-200"
            >
              Отправить запрос
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
