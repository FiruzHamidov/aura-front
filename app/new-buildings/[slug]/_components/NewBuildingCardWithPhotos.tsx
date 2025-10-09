import { useNewBuildingPhotos } from '@/services/new-buildings/hooks';
import NewBuildingCard from '@/ui-components/new-buildings/new-buildings-card';

// eslint-disable-next-line
export function NewBuildingCardWithPhotos({ building }: { building: any }) {
  const { data: photos } = useNewBuildingPhotos(building.id);

  return (
    <NewBuildingCard
      key={building.id}
      id={building.id}
      slug={building.id.toString()}
      title={building.title}
      subtitle={building.description || ''}
      photos={photos || []}
      image={{
        src:
          photos?.[0]?.path || building.photos?.[0]?.path
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${
                photos?.[0]?.path || building.photos?.[0]?.path
              }`
            : '/images/placeholder.png',
        alt: building.title,
      }}
      apartmentOptions={[]}
      location={building.address || 'Душанбе'}
      developer={
        building?.developer?.name
          ? {
              name: building.developer.name,
              logo_path: building.developer.logo_path,
            }
          : {
              name: 'Неизвестно',
              logo_path: '/images/placeholder.png',
            }
      }
      hasInstallmentOption={building.installment_available}
    />
  );
}
