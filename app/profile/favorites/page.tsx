'use client';

import { useMe } from '@/services/login/hooks';
import { useFavorites } from '@/services/favorites/hooks';
import BuyCard from '@/app/_components/buy/buy-card';
import BuyCardSkeleton from '@/ui-components/BuyCardSkeleton';
import Link from 'next/link';

export default function ProfileFavorites() {
  const { data: user } = useMe();
  const { data: favorites, isLoading } = useFavorites(!!user);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] h-max mb-10 md:mb-16">
        {Array.from({ length: 6 }).map((_, index) => (
          <BuyCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          У вас пока нет избранных объявлений
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] h-max mb-10 md:mb-16">
      {favorites.map((favorite) => (
        <Link key={favorite.id} href={`/apartment/${favorite.property.id}`}>
          <BuyCard listing={favorite.property} />
        </Link>
      ))}
    </div>
  );
}
