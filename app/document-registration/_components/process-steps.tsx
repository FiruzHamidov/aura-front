import Image from 'next/image';

const steps = [
  { number: 1, text: 'Вы оставляете заявку' },
  { number: 2, text: 'Бесплатная консультация' },
  { number: 3, text: 'Подготовка документов' },
  { number: 4, text: 'Проверка и подписание' },
  { number: 5, text: 'Подача в госорганы' },
  { number: 6, text: 'Получение готовых бумаг' },
];

export const ProcessSteps = () => {
  return (
    <div className="flex items-center justify-stretch gap-5">
      {/* Left side - Steps */}
      <div className="bg-white w-[70%] rounded-[22px] px-[50px] pt-[50px] pb-[70px]">
        <h2 className="text-4xl font-bold text-gray-900 mb-[50px]">
          Как проходит процесс?
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

      {/* Right side - Image */}
      <div className="relative self-stretch bg-white rounded-[22px] px-9 py-[43px]">
        <Image
          src="/images/extra-pages/doc-process.png" // Replace with actual image path
          alt="Document signing process"
          width={600}
          height={400}
          className="w-full h-full rounded-2xl fill-[#0036A542]/[26%] text-[#0036A542]/[26%] object-cover"
        />
      </div>
    </div>
  );
};
