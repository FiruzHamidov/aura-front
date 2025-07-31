import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ExtraPagesBannerProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  imageUrl: string;
  imageAlt: string;
}

export const ExtraPagesBanner: FC<ExtraPagesBannerProps> = ({
  title,
  description,
  buttonLabel,
  buttonLink,
  imageUrl,
  imageAlt,
}) => {
  return (
    <div className="bg-white rounded-[22px] flex gap-[100px]">
      <div className="pt-10 pb-[100px] pl-[58px]">
        <h2 className="mb-5 font-bold text-[40px]">{title}</h2>
        <p className="mb-10 font-normal text-[#353E5C] text-2xl">
          {description}
        </p>
        <Link href={buttonLink}>
          <button className="bg-[#0036A5] rounded-full px-11 py-[21px] text-white hover:bg-blue-800 transition-colors text-lg">
            {buttonLabel}
          </button>
        </Link>
      </div>
      <Image
        src={imageUrl}
        alt={imageAlt}
        width={455}
        height={455}
        className=""
      />
    </div>
  );
};
