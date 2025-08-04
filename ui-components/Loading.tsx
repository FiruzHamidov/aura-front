import Logo from '@/icons/Logo';

export const Loading = () => {
  return (
    <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <Logo className="w-36 h-11" />
        </div>
        {/* <div className="mt-4 text-lg text-[#0036A5] font-medium">{title}</div> */}
        <div className="mt-6 flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-white rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
};
