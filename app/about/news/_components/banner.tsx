import Logo3 from '@/icons/Logo3';

const NewsBanner = () => {
  return (
    <div className="bg-blue-700 rounded-[22px] px-[60px] py-10 mb-14 relative overflow-hidden h-[315px]">
      <div className="relative z-10 text-white">
        <h1 className="text-[56px] font-bold mb-1">Все новости</h1>
        <div className="text-lg">Полезные новости и статьи</div>
      </div>

      {/* Background logo */}
      <div className="absolute right-5 -bottom-16">
        <Logo3 className="w-[720px] h-[214px]" />
      </div>
    </div>
  );
};

export default NewsBanner;
