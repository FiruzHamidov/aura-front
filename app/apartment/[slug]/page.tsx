'use client';

import { useParams } from 'next/navigation';
import { useGetPropertyByIdQuery } from '@/services/properties/hooks';
import { PropertyPhoto } from '@/services/properties/types';
import GalleryWrapper from './_components/GalleryWrapper';
import { STORAGE_URL } from '@/constants/base-url';
import { Loading } from '@/ui-components/Loading';

export default function ApartmentPage() {
  const { slug } = useParams();

  const {
    data: apartment,
    isLoading,
    error,
  } = useGetPropertyByIdQuery(slug as string);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !apartment) {
    return <div>Ошибка при загрузке объекта</div>;
  }

  const photos: string[] =
    apartment.photos?.map(
      (p: PropertyPhoto) => `${STORAGE_URL}/${p.file_path}`
    ) ?? [];

  return <GalleryWrapper apartment={apartment} photos={photos} />;
}
