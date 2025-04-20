import Logo2 from '@/icons/Logo2';

export const Company = () => {
  return (
    <div className="pb-[60px]">
      <h1 className="text-[56px] font-bold mb-[31px] text-[#020617]">
        О компании
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-11">
        <div className="max-w-2xl">
          <p className="text-lg text-[#666F8D] leading-relaxed">
            В Aura Estate мы стремимся сделать процесс покупки или продажи
            недвижимости максимально приятным и беззаботным для наших клиентов.
            Наша команда опытных риэлторов обладает глубокими знаниями рынка
            недвижимости в Душанбе и готова помочь вам найти идеальный вариант,
            соответствующий вашим потребностям и ожиданиям.
          </p>
        </div>

        <div className="md:max-w-sm xl:max-w-md">
          <Logo2 className="w-[430px] h-[139px]" />
        </div>
      </div>

      <div className="flex gap-5 mb-16">
        <div className="bg-white py-[18px] px-6 rounded-xl w-max">
          <h2 className="text-[32px] font-bold text-[#0036A5] mb-1">$100M</h2>
          <p className="text-[#666F8D]">Текущий объем листинга</p>
        </div>

        <div className="bg-white py-[18px] px-6 rounded-xl w-max">
          <h2 className="text-[32px] font-bold text-[#0036A5] mb-1">$400M</h2>
          <p className="text-[#666F8D]">Всего продано за 2019-2024 г.</p>
        </div>

        <div className="bg-white py-[18px] px-6 rounded-xl w-max">
          <h2 className="text-[32px] font-bold text-[#0036A5] mb-1">$2B</h2>
          <p className="text-[#666F8D]">Объем продаж за весь срок службы</p>
        </div>
      </div>
      <iframe
        width="100%"
        height="420"
        src="https://www.youtube.com/embed/-FE4Po023WY?si=JCakGqwz3TTBbB8S"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-[22px]"
      ></iframe>
    </div>
  );
};
