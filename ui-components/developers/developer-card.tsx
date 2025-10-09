import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Developer } from '@/services/new-buildings/types';
import { STORAGE_URL } from '@/constants/base-url';
import FacebookIcon from '@/icons/FacebookIcon';
import InstagramIcon from '@/icons/InstagramIcon';
import WhatsappNoBgIcon from '@/icons/WhatsappNoBgIcon';

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: FC<DeveloperCardProps> = ({ developer }) => {
  const logoUrl = developer.logo_path
    ? `${STORAGE_URL}/${developer.logo_path}`
    : '/images/placeholder-developer.png';

  return (
    <Link
      href={`/developers/${developer.id}`}
      className="bg-white rounded-[22px] p-6 hover:shadow-lg transition-shadow block"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={logoUrl}
            alt={developer.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-1">{developer.name}</h3>
          <p className="text-[#666F8D] text-sm">Застройщик</p>
        </div>
      </div>

      {developer.description && (
        <p className="text-[#666F8D] text-sm mb-4 line-clamp-2">
          {developer.description}
        </p>
      )}

      <div className="space-y-2 text-sm text-[#666F8D] mb-4">
        {developer.founded_year && (
          <div className="flex justify-between">
            <span>Год основания</span>
            <span className="font-medium text-gray-900">
              {developer.founded_year}
            </span>
          </div>
        )}
        {developer.under_construction_count !== undefined && (
          <div className="flex justify-between">
            <span>Строится</span>
            <span className="font-medium text-gray-900">
              {developer.under_construction_count}
            </span>
          </div>
        )}
        {developer.built_count !== undefined && (
          <div className="flex justify-between">
            <span>Построено</span>
            <span className="font-medium text-gray-900">
              {developer.built_count}
            </span>
          </div>
        )}
        {developer.total_projects !== undefined && (
          <div className="flex justify-between">
            <span>Всего объектов</span>
            <span className="font-medium text-gray-900">
              {developer.total_projects}
            </span>
          </div>
        )}
      </div>

      {/* Social media links */}
      <div className="flex gap-2">
        {developer.facebook && (
          <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center">
            <FacebookIcon className="w-4 h-4 text-white" />
          </div>
        )}
        {developer.instagram && (
          <div className="w-8 h-8 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] rounded-full flex items-center justify-center">
            <InstagramIcon className="w-4 h-4 text-white" />
          </div>
        )}
        {developer.phone && (
          <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
            <WhatsappNoBgIcon className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </Link>
  );
};

export default DeveloperCard;
