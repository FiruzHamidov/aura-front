import Image from 'next/image';

const cardsData = [
  {
    image: '/images/extra-pages/handshake.png',
    description: 'Выкупаем жильё, коммерцию',
  },
  {
    image: '/images/extra-pages/document.png',
    description: 'Полное оформление под ключ',
  },
  {
    image: '/images/extra-pages/gold-money.png',
    description: 'Срочная выплата наличными или на счёт',
  },
  {
    image: '/images/extra-pages/home-search.png',
    description: 'Бесплатная оценка объекта',
  },
];

export const Cards = () => {
  return (
    <div>
      <div className="flex justify-between gap-5">
        {cardsData?.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl px-[30px] pt-10 pb-[50px]"
          >
            <Image
              src={item.image}
              alt={item.description}
              width={144}
              height={144}
              className="mb-[26px]"
            />
            <p className="text-[20px]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
