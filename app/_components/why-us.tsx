import Image from 'next/image';
import { FC } from 'react';

interface WhyUsItem {
  image: string;
  description: string;
}

interface WhyUsProps {
  title: string;
  items: WhyUsItem[];
}

export const WhyUs: FC<WhyUsProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-[22px] py-10 px-[58px]">
      <h2 className="font-bold text-4xl mb-[30px]">{title}</h2>

      <div className="flex justify-between gap-[90px]">
        {items?.map((item, index) => (
          <div key={index}>
            <Image
              src={item.image}
              alt={item.description}
              width={144}
              height={144}
              className="mb-1.5 mx-auto"
            />
            <p className="text-[#353E5C] text-lg text-center">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
