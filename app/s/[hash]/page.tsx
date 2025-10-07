import { axios } from '@/utils/axios';
import { SelectionPublic } from '@/services/selection/selection';
import SelectionView from '@/app/_components/selection/SelectionView';
import { Property } from '@/services/properties/types';

type Params = { hash: string };
type PageProps = { params: Params | Promise<Params> };

export default async function SelectionPage({ params }: PageProps) {
    // Support both Next 14 (object) and Next 15 (Promise) param typing
    const resolved = 'then' in params ? await params : params;
    const { hash } = resolved;

    // 1) Получаем подборку по hash
    const { data: selection } = await axios.get<SelectionPublic>(`/selections/public/${hash}`);

    // 2) Грузим объекты по id (по одному — API уже есть /properties/{id})
    const propsList = await Promise.all(
        selection.property_ids.map(async (id) => {
            const { data } = await axios.get<Property>(`/properties/${id}`);
            return data;
        })
    );

    return <SelectionView selection={selection} initialProperties={propsList} />;
}