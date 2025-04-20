import Logo3 from '@/icons/Logo3';

const NewsBanner = () => {
  return (
    <div className="bg-blue-700 rounded-[22px] px-[60px] py-10 mb-14 relative overflow-hidden h-[315px]">
      <div className="relative z-10 text-white">
        <h1 className="text-[40px] leading-12 font-bold">
          ТОП-10 ошибок при ремонте <br /> квартиры: как сохранить бюджет и
          нервы
        </h1>
      </div>

      <div className="absolute right-5 -bottom-16">
        <Logo3 className="w-[720px] h-[214px]" />
      </div>
    </div>
  );
};

export default NewsBanner;
