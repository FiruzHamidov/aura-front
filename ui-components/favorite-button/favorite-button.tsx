'use client';

import { FC, MouseEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeartIcon from '@/icons/HeartIcon';
import { useMe } from '@/services/login/hooks';
import { useToggleFavorite, useFavorites } from '@/services/favorites/hooks';
import { toast } from 'react-toastify';
import { FavoriteResponse } from '@/services/favorites/types';

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
  iconClassName?: string;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({
  propertyId,
  className = '!bg-white/30 flex items-center justify-center cursor-pointer p-2 rounded-full shadow transition w-[37px] h-[37px]',
  iconClassName = 'w-[18px] h-[18px] text-[#0036A5]',
}) => {
  const router = useRouter();
  const { data: user } = useMe();

  const { data: favorites = [] } = useFavorites(!!user);
  const toggleFavorite = useToggleFavorite();

  const isFavorite = Array.isArray(favorites) && favorites.some(
      (favorite: FavoriteResponse) => favorite.property?.id === propertyId
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.warning(
        'Войдите в аккаунт, чтобы добавить объявление в избранное',
        {
          position: 'top-center',
          autoClose: 3000,
        }
      );

      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      await toggleFavorite.mutateAsync({
        propertyId,
        isFavorite,
      });

      if (isFavorite) {
        toast.success('Объявление удалено из избранного', {
          position: 'top-center',
          autoClose: 2000,
        });
      } else {
        toast.success('Объявление добавлено в избранное', {
          position: 'top-center',
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Произошла ошибка. Попробуйте еще раз', {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <HeartIcon
        className={`${iconClassName} ${
          isFavorite ? '!text-[#0036A5] !fill-[#0036A5] !opacity-100' : ''
        } ${isLoading ? 'opacity-50' : ''}`}
      />
    </div>
  );
};

export default FavoriteButton;
