import Image from 'next/image';

export const ProcessSteps = () => {
  return (
    <div className="flex items-center justify-stretch gap-5">
      <div className="relative self-stretch bg-white rounded-[22px] px-9 py-[43px]">
        <Image
          src="/images/extra-pages/doc-process.png"
          alt="Document signing process"
          width={600}
          height={400}
          className="w-full h-full rounded-2xl fill-[#0036A542]/[26%] text-[#0036A542]/[26%] object-cover"
        />
      </div>

      <div className="bg-white w-[70%] rounded-[22px] p-[50px]">
        <h2 className="text-[32px] font-bold text-gray-900 mb-9">
          Как проходит процесс?
        </h2>

        <div className="space-y-8 text-2xl text-[#353E5C]">
          <div>
            Процесс клининговых услуг начинается с оформления заявки клиент
            оставляет свои данные и указывает пожелания по уборке. После этого
            менеджер связывается для уточнения деталей: тип помещения, объём
            работ, предпочтительное время и особенности уборки. Затем
            согласовывается стоимость и назначается удобное время.
          </div>

          <div>
            В назначенный день приезжает команда клинеров с профессиональным
            оборудованием и сертифицированными чистящими средствами. Уборка
            проводится по заранее утверждённому плану: от стандартной чистки до
            глубокой уборки труднодоступных мест. По завершении проводится
            контроль качества, и если всё соответствует ожиданиям, клиент
            принимает работу и производит оплату удобным способом.
          </div>
        </div>
      </div>
    </div>
  );
};
