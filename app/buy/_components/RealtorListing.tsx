import {useGetPropertiesQuery} from "@/services/properties/hooks";
import {PropertyFilters} from "@/services/properties/types";
import Buy from "@/app/_components/buy/buy";

type RealtorListingsProps = {
    slug: string;
    selectedRooms: number[]; // [1,2,3,4,5] где 5 == "5+"
};

// проверяем «непрерывность» выбора (например 2,3,4 или 3,4,5)
const isContiguous = (arr: number[]) => {
    if (arr.length <= 1) return true;
    for (let i=1;i<arr.length;i++){
        // специальный кейс для 5+: считаем, что после 4 может быть 5 (5+)
        const prev = arr[i-1];
        const cur = arr[i];
        if (!(cur === prev + 1)) return false;
    }
    return true;
};

export const RealtorListings: React.FC<RealtorListingsProps> = ({ slug, selectedRooms }) => {
    // если выбрано «Все» — не добавляем комнатные фильтры вообще
    const allSelected = selectedRooms.length === 5;

    // Готовим фильтры
    const buildFilters = (): PropertyFilters => {
        const base: PropertyFilters = {
            created_by: slug,
            listing_type: 'regular',
            offer_type: 'sale',
        };

        if (allSelected) return base;

        const sorted = [...selectedRooms].sort((a,b)=>a-b);
        // если выбор непрерывный — шлём roomsFrom/roomsTo
        if (isContiguous(sorted)) {
            base.roomsFrom = String(sorted[0]);
            base.roomsTo = String(sorted[sorted.length - 1]);
            return base;
        }

        // если выбор разорванный — шлём rooms как csv
        // 5+ мапим как "5", бэкенд трактует 5 как >=5
        base.rooms = sorted.join(',');
        return base;
    };

    const filters = buildFilters();

    const { data: propertiesResponse, isLoading } = useGetPropertiesQuery(filters);

    const propertiesForBuy = propertiesResponse ?? {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
        first_page_url: '',
        last_page_url: '',
        links: [],
        next_page_url: null,
        path: '',
        prev_page_url: null,
    };

    return (
        <div className="mt-6">
            <Buy
                properties={propertiesForBuy}
                isLoading={isLoading}
                hasTitle={false}
            />
        </div>
    );
};

export const Chip: React.FC<{active:boolean; onClick:()=>void; children:React.ReactNode}> = ({active,onClick,children}) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-full border transition
      ${active ? 'bg-[#0036A5] text-white border-[#0036A5]' : 'bg-white text-[#020617] border-[#BAC0CC]'}
    `}
    >
        {children}
    </button>
);