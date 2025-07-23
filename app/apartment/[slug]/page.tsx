import { Property, PropertyPhoto } from '@/services/properties/types';
import GalleryWrapper from './_components/GalleryWrapper';
import { STORAGE_URL } from '@/constants/base-url';

async function getApartment(id: string): Promise<Property> {
  const res = await fetch(`https://backend.aura.tj/api/properties/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Ошибка при получении объекта');
  }

  return res.json();
}

export default async function ApartmentPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const apartment = await getApartment(slug);

  const photos: string[] =
    apartment.photos?.map(
      (p: PropertyPhoto) => `${STORAGE_URL}/${p.file_path}`
    ) ?? [];

  return <GalleryWrapper apartment={apartment} photos={photos} />;
}
