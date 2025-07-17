'use client';

import { useMe } from '@/services/login/hooks';
import { useFavorites } from '@/services/favorites/hooks';
import BuyCard from '@/app/_components/buy/buy-card';

export default function ProfileFavorites() {
  const { data: user } = useMe();
  const { data: favorites, isLoading } = useFavorites(!!user);

  if (isLoading) {
    return <div className="text-center py-8">Загрузка...</div>;
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
        <BuyCard key={favorite.id} listing={favorite.property} />
      ))}
    </div>
  );
}
