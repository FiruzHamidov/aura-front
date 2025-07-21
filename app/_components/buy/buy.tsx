import { FC, useMemo } from 'react';
import BuyCard from './buy-card';
import Link from 'next/link';
import { PropertiesResponse } from '@/services/properties/types';

const Buy: FC<{
  properties: PropertiesResponse | undefined;
  hasTitle?: boolean;
}> = ({ properties, hasTitle = true }) => {
  const buyListings = useMemo(() => {
    if (!properties?.data) return [];

    return properties.data;
  }, [properties]);

  if (!properties) {
    return (
      <section>
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
            Купить
          </h2>
          <div className="text-center py-6">Загрузка объявлений...</div>
        </div>
      </section>
    );
  }

  if (buyListings.length === 0) {
    return (
      <section>
        <div className="container">
          <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
            Купить
          </h2>
          <div className="text-center py-6">
            Объявления о продаже не найдены
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        {hasTitle && (
          <h2 className="text-2xl md:text-4xl font-bold text-[#020617] mb-6 md:mb-10">
            Купить
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-[14px]">
          {buyListings.map((listing) => (
            <Link key={listing.id} href={`/apartment/${listing.id}`}>
              <BuyCard listing={listing} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Buy;
