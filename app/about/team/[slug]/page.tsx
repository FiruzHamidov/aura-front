'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import TelegramNoBgIcon from '@/icons/TelegramNoBgIcon';
import PhoneNoBgIcon from '@/icons/PhoneNoBgIcon';
import WhatsAppNoBgIcon from '@/icons/WhatsappNoBgIcon';
import ThumbsUpIcon from '@/icons/ThumbsUp';
import PencilIcon from '@/icons/PencilIcon';
import { toast } from 'react-toastify';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface Realtor {
  id: number;
  name: string;
  position: string | null;
  avatar: string | null;
  phone: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

const Rating = ({ value }: { value: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
          <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={i < value ? '#094BAD' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                stroke={i < value ? '#094BAD' : '#D1D5DB'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
          </svg>
      ))}
    </div>
);

const RealtorPage = () => {
  const params = useParams();
  const id = params?.id; // из /about/team/[id]

  const [realtorData, setRealtorData] = useState<Realtor | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const reviewsPerPage = 4;

  useEffect(() => {
    if (id) {
      fetchRealtor(id.toString());
    }
  }, [id]);

  const fetchRealtor = async (userId: string) => {
    try {
      const res = await axios.get(`https://backend.aura.tj/api/user/${userId}`);
      const data = res.data;

      const realtor: Realtor = {
        id: data.id,
        name: data.name,
        position: data.role?.name ?? 'Агент',
        avatar: data.photo,
        phone: data.phone,
        rating: 5, // TODO: получить из API
        reviewCount: 10, // TODO: получить из API
        reviews: [], // TODO: получить отзывы с API, если есть
      };

      setRealtorData(realtor);
    } catch (err) {
      toast.error(`Ошибка при загрузке данных риелтора ${err}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Форма отправлена');
    setName('');
    setPhone('');
  };

  if (!realtorData) return <div className="p-6 text-center">Загрузка...</div>;

  const currentReviews = realtorData.reviews.slice(
      (currentPage - 1) * reviewsPerPage,
      currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(realtorData.reviews.length / reviewsPerPage);

  return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-3.5">
            {/* Левая часть */}
            <div className="md:w-2/3">
              <div className="flex gap-[22px] bg-white p-10 rounded-[22px]">
                <div className="relative w-[120px] h-[120px] rounded-full overflow-hidden flex-shrink-0">
                  <Image
                      src={realtorData.avatar || '/images/team/1.png'}
                      alt={realtorData.name}
                      fill
                      className="object-cover"
                  />
                </div>

                <div>
                  <div className="text-[#353E5C]">{realtorData.position}</div>
                  <h1 className="text-[32px] font-bold">{realtorData.name}</h1>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 rounded-[26px] text-[#666F8D] bg-[#F7F8FA] px-2.5 py-2">
                      <ThumbsUpIcon className="w-5 h-5" />
                      <span>{realtorData.rating}</span>
                    </div>
                    <div className="text-[#666F8D]">{realtorData.reviewCount} отзывов</div>
                  </div>

                  <div className="mt-3">
                    <a
                        href={`tel:${realtorData.phone.replace(/\s/g, '')}`}
                        className="text-[24px] font-bold text-[#0036A5] block mb-3"
                    >
                      {realtorData.phone}
                    </a>
                    <div className="flex gap-2">
                      <a href="#" aria-label="Telegram">
                        <TelegramNoBgIcon className="w-12 h-12" />
                      </a>
                      <a href={`tel:${realtorData.phone.replace(/\s/g, '')}`} aria-label="Phone">
                        <PhoneNoBgIcon className="w-12 h-12" />
                      </a>
                      <a href="#" aria-label="WhatsApp">
                        <WhatsAppNoBgIcon className="w-12 h-12" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Отзывы */}
              <div className="mt-[52px]">
                <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10">Отзывы</h2>
                <div className="mb-6">
                  <button className="inline-flex items-center gap-1 p-2.5 rounded-full border border-[#BAC0CC] text-lg">
                    <div className="bg-[#0036A5] p-1 rounded-full w-8 h-8">
                      <PencilIcon className="w-6 h-6" />
                    </div>
                    Оставить отзыв
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-x-5 gap-y-5">
                  {currentReviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-[22px] p-5">
                        <div className="mb-1">
                          <div className="text-lg mb-2">{review.author}</div>
                          <div className="flex items-center justify-between mb-3.5">
                            <Rating value={review.rating} />
                            <div className="text-lg text-[#666F8D]">{review.date}</div>
                          </div>
                        </div>
                        <p className="text-lg text-[#666F8D]">{review.text}</p>
                      </div>
                  ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-start mt-6">
                      <div className="flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-[62px] h-[62px] rounded-full flex items-center justify-center text-2xl cursor-pointer ${
                                    currentPage === i + 1
                                        ? 'bg-[#0036A5] text-white'
                                        : 'bg-white text-[#020617]'
                                }`}
                            >
                              {i + 1}
                            </button>
                        ))}
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Правая часть - форма */}
            <div className="bg-white p-8 pt-11 pb-14 rounded-[22px] md:w-1/3 h-max">
              <h2 className="text-2xl font-bold text-[#666F8D] mb-[30px] text-center">Обратная связь</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full p-5 text-lg rounded-full bg-[#F0F2F5] border-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                  />
                </div>
                <div className="mb-4">
                  <input
                      type="tel"
                      placeholder="Телефон"
                      className="w-full p-5 text-lg rounded-full bg-[#F0F2F5] border-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                  />
                </div>
                <button
                    type="submit"
                    className="w-full text-lg bg-[#0036A5] text-white py-5 rounded-full font-bold"
                >
                  Позвонить мне
                </button>
                <p className="text-sm text-[#666F8D] mt-[15px]">
                  Нажимая на кнопку «Позвоните мне», я даю согласие на обработку{' '}
                  <a href="#" className="underline">
                    персональных данных
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RealtorPage;