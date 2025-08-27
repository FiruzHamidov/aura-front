import { FC, useMemo } from 'react';
import BuyCard from './buy-card';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import { PropertiesResponse } from '@/services/properties/types';
import {useProfile} from "@/services/login/hooks";

const Buy: FC<{
  properties: PropertiesResponse | undefined;
  hasTitle?: boolean;
  isLoading?: boolean;
}> = ({ properties, hasTitle = true, isLoading = false }) => {
  const {data: user} = useProfile();
  const buyListings = useMemo(() => {
    if (!properties?.data) return [];

    return properties.data;
  }, [properties]);

  if (isLoading) {
    return (
      <section>
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
          {hasTitle && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
              Купить
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[30px]">
            {Array.from({ length: 8 }).map((_, index) => (
              <BuyCardSkeleton key={index}  />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!properties) {
    return (
      <section>
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
          {hasTitle && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
              Купить
            </h2>
          )}
          <div className="text-center py-6">Загрузка объявлений...</div>
        </div>
      </section>
    );
  }

  if (buyListings.length === 0) {
    return (
      <section>
        <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
          {hasTitle && (
            <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
              Купить
            </h2>
          )}
          <div className="text-center py-6">
            Объявления о продаже не найдены
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">
        {hasTitle && (
          <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
            Купить
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-[30px]">
          {buyListings.map((listing) => (
              <BuyCard listing={listing} user={user} key={listing.id}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Buy;
