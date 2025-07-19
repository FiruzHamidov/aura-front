import { Property, PropertyPhoto } from '@/services/properties/types';
import GalleryWrapper from './_components/GalleryWrapper';

async function getApartment(id: string): Promise<Property> {
    const res = await fetch(`https://backend.aura.tj/api/properties/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Ошибка при получении объекта');
    }

    return res.json();
}

export default async function ApartmentPage({ params }: { params: { slug: string } }) {
    const apartment = await getApartment(params.slug);

    const photos: string[] = apartment.photos?.map(
        (p: PropertyPhoto) => `https://backend.aura.tj/storage/${p.file_path}`
    ) ?? [];

    return (
        <GalleryWrapper
            apartment={apartment}
            photos={photos}
        />
    );
}