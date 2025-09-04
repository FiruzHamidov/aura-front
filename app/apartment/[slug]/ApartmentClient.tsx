'use client';

import { useGetPropertyByIdQuery } from '@/services/properties/hooks';
import { PropertyPhoto } from '@/services/properties/types';
import GalleryWrapper from './_components/GalleryWrapper';
import { STORAGE_URL } from '@/constants/base-url';
import { Loading } from '@/ui-components/Loading';

export default function ApartmentClient({ slug }: { slug: string }) {
    const {
        data: apartment,
        isLoading,
        error,
    } = useGetPropertyByIdQuery(slug);

    if (isLoading) return <Loading />;

    if (error || !apartment) {
        return <div>Ошибка при загрузке объекта</div>;
    }

    const photos: string[] =
        apartment.photos?.map(
            (p: PropertyPhoto) => `${STORAGE_URL}/${p.file_path}`
        ) ?? [];

    return <GalleryWrapper apartment={apartment} photos={photos} />;
}