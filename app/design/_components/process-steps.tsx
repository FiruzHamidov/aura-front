import Image from 'next/image';

const steps = [
  { number: 1, text: 'Несколько вариантов планировки' },
  { number: 2, text: '4-6 ракурсов 3D-визуализации каждой комнаты' },
  {
    number: 3,
    text: '25 листов чертежей, подробно иллюстрирующих все технические моменты',
  },
  {
    number: 4,
    text: 'Полный перечень материалов, которые понадобятся для ремонтных работ',
  },
  { number: 5, text: 'Расчет бюджета проекта' },
  { number: 6, text: 'Смету на ремонтно-отделочные работы' },
];

export const ProcessSteps = () => {
  return (
    <div className="flex items-center justify-stretch gap-5">
      {/* Left side - Steps */}
      <div className="relative flex-1 self-stretch bg-white rounded-[22px] px-9 py-10">
        <div className="text-[32px] font-bold mb-8">Состав дизайн-проекта</div>

        <div className="text-2xl leading-8 text-[#353E5C] mb-6">
          Готовый дизайн-проект - это инструкция по проведению ремонта, поэтому
          его можно отдать на реализацию прорабу или руководить командой
          строителей самостоятельно. По окончании работ по созданию
          дизайн-проекта вы получите пакет документов - гид по вашему будущему
          интерьеру.
        </div>
        <Image
          src="/images/extra-pages/design-arch.png"
          alt="Document signing process"
          width={492}
          height={358}
          className="w-[492px] h-[358px] absolute"
        />
      </div>

      {/* Right side - Image */}

      <div className="bg-white flex-1 rounded-[22px] px-[50px] pt-[50px] pb-[70px]">
        <h2 className="text-4xl font-bold text-gray-900 mb-[50px]">
          Документ включает в себя:
        </h2>

        <div className="space-y-10">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-6 relative">
              {/* Step number */}
              <div className="flex-shrink-0 w-[50px] h-[50px] bg-[#0036A5] text-white rounded-full flex items-center justify-center font-bold text-2xl">
                {step.number}
              </div>

              {/* Step text */}
              <p className="text-2xl text-[#353E5C] ">{step.text}</p>

              {/* Connecting line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 mt-[88px] w-[9px] rounded-full h-8 bg-[#E3E6EA]"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
