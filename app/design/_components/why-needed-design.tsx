import Image from 'next/image';

export const WhyNeededDesign = () => {
  return (
    <div className="bg-white rounded-[22px] flex gap-[79px]">
      <div className="mt-10 ml-[60px] mb-20">
        <div className="text-[32px] font-bold mb-8">
          Зачем нужен дизайн-проект?
        </div>
        <div className="text-2xl leading-8 text-[#353E5C]">
          Задача дизайн-проекта интерьера квартиры - ответить на всевозможные
          вопросы прораба и строителей, которые будут реализовывать проект.
          Тщательно подготовленный дизайн-проект оптимизирует ремонт, позволяя
          избежать лишних трат и простоев в работе.
          <br />
          <br />
          При создании интерьера вашей квартиры мы разрабатываем подробный
          дизайн-проект. В него входят все необходимые документы для проведения
          ремонта: от общей концепции интерьера до детализированных технических
          чертежей.
        </div>
      </div>
      <Image
        src={'/images/extra-pages/design-why-needed.png'}
        width={551}
        height={523}
        alt="Почему нужен дизайн"
        className="mt-[106px] mr-5 w-[551px] h-[523px] object-cover"
      />
    </div>
  );
};
