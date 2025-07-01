'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { axios } from "@/utils/axios";
import Image from 'next/image';

interface SelectOption {
    id: number;
    name: string;
    city?: string;
}

interface FormState {
    title: string;
    description: string;
    location_id: string;
    repair_type_id: string;
    heating_type_id: string;
    parking_type_id: string;
    owner_phone: string;
    price: string;
    currency: string;
    total_area: string;
    living_area: string;
    floor: string;
    total_floors: string;
    year_built: string;
    youtube_link: string;
    condition: string;
    apartment_type: string;
    has_garden: boolean;
    has_parking: boolean;
    is_mortgage_available: boolean;
    is_from_developer: boolean;
    landmark: string;
    latitude: string;
    longitude: string;
    agent_id: string;
    photos: File[];
}

export default function AddPost() {
    const [propertyTypes, setPropertyTypes] = useState<SelectOption[]>([]);
    const [buildingTypes, setBuildingTypes] = useState<SelectOption[]>([]);
    const [locations, setLocations] = useState<SelectOption[]>([]);
    const [repairTypes, setRepairTypes] = useState<SelectOption[]>([]);
    const [heatingTypes, setHeatingTypes] = useState<SelectOption[]>([]);
    const [parkingTypes, setParkingTypes] = useState<SelectOption[]>([]);

    const [selectedOfferType, setSelectedOfferType] = useState<string>('sale');
    const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null);
    const [selectedBuildingType, setSelectedBuildingType] = useState<number | null>(null);
    const [selectedRooms, setSelectedRooms] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);

    const [form, setForm] = useState<FormState>({
        title: '',
        description: '',
        location_id: '',
        repair_type_id: '',
        heating_type_id: '',
        parking_type_id: '',
        price: '',
        currency: 'TJS',
        total_area: '',
        living_area: '',
        floor: '',
        total_floors: '',
        year_built: '',
        youtube_link: '',
        condition: '',
        apartment_type: '',
        has_garden: false,
        has_parking: false,
        is_mortgage_available: false,
        is_from_developer: false,
        landmark: '',
        latitude: '',
        longitude: '',
        agent_id: '',
        photos: [],
        owner_phone: '',
    });

    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const urls = form.photos.map(file => URL.createObjectURL(file));
        setPhotoPreviews(urls);
        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [form.photos]);

    async function fetchData() {
        const endpoints: [string, React.Dispatch<React.SetStateAction<SelectOption[]>>][] = [
            ['property-types', setPropertyTypes],
            ['building-types', setBuildingTypes],
            ['locations', setLocations],
            ['repair-types', setRepairTypes],
            ['heating-types', setHeatingTypes],
            ['parking-types', setParkingTypes]
        ];

        for (const [endpoint, setter] of endpoints) {
            const data: SelectOption[] = await fetch(`https://back.aura.bapew.tj/api/${endpoint}`).then(res => res.json());
            setter(data);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const target = e.target as HTMLInputElement;
        const newValue = type === 'checkbox' ? target.checked : value;
        setForm(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setForm(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
    };

    const removePhoto = (index: number) => {
        setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
    };

    const prepareValue = (val: string) => val === '' ? '' : val;

    const getAuthToken = (): string | null => {
        if (typeof window !== "undefined") {
            const cookies = document.cookie.split(";");
            const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="));
            if (tokenCookie) return decodeURIComponent(tokenCookie.split("=")[1]);
        }
        return null;
    };

    function appendIfFilled(formData: FormData, key: string, value: unknown) {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            formData.append(key, value.toString());
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        const token = getAuthToken();


        formData.append('description', form.description);
        formData.append('type_id', String(selectedPropertyType));
        formData.append('status_id', String(selectedBuildingType));
        formData.append('location_id', prepareValue(form.location_id));
        formData.append('repair_type_id', prepareValue(form.repair_type_id));
        formData.append('heating_type_id', prepareValue(form.heating_type_id));
        formData.append('parking_type_id', prepareValue(form.parking_type_id));
        formData.append('price', form.price);
        formData.append('currency', form.currency);
        formData.append('offer_type', selectedOfferType);
        formData.append('rooms', String(selectedRooms));
        formData.append('total_area', prepareValue(form.total_area));
        formData.append('living_area', prepareValue(form.living_area));
        formData.append('floor', prepareValue(form.floor));
        formData.append('total_floors', prepareValue(form.total_floors));
        formData.append('year_built', prepareValue(form.year_built));
        formData.append('condition', prepareValue(form.condition));
        formData.append('apartment_type', prepareValue(form.apartment_type));
        formData.append('has_garden', form.has_garden ? '1' : '0');
        formData.append('has_parking', form.has_parking ? '1' : '0');
        formData.append('is_mortgage_available', form.is_mortgage_available ? '1' : '0');
        formData.append('is_from_developer', form.is_from_developer ? '1' : '0');
        formData.append('landmark', prepareValue(form.landmark));
        appendIfFilled(formData, 'owner_phone', form.owner_phone);
        appendIfFilled(formData, 'youtube_link', form.youtube_link);
        appendIfFilled(formData, 'latitude', form.latitude);
        appendIfFilled(formData, 'longitude', form.longitude);
        appendIfFilled(formData, 'agent_id', form.agent_id);

        form.photos.forEach(file => formData.append('photos[]', file));

        try {
            await axios.post('/properties', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            });

            alert('Успешно добавлено!');
        } catch (err) {
            console.error(err);
            alert('Ошибка при добавлении');
        }
    };

    return (
        <div className="container mx-auto py-8 bg-white rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Добавить объявление</h1>

            {step === 1 && (
                <div className="flex flex-col gap-6">
                    <SelectToggle title="Сделка" options={[{ id: 'sale', name: 'Продажа' }, { id: 'rent', name: 'Аренда' }]} selected={selectedOfferType} setSelected={setSelectedOfferType} />
                    <SelectToggle title="Тип недвижимости" options={propertyTypes} selected={selectedPropertyType} setSelected={setSelectedPropertyType} />
                    <SelectToggle title="Тип объекта" options={buildingTypes} selected={selectedBuildingType} setSelected={setSelectedBuildingType} />
                    <SelectToggle title="Количество комнат" options={[1,2,3,4,5,6].map(num => ({ id: num, name: num === 6 ? '6 и больше' : `${num}-комнатные` }))} selected={selectedRooms} setSelected={setSelectedRooms} />
                    <div className="flex justify-end">
                        <button className="mt-8 px-6 py-3 bg-[#0036A5] text-white rounded-lg" onClick={() => setStep(2)} disabled={!selectedPropertyType || !selectedBuildingType || !selectedRooms}>
                            Продолжить
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <h2 className="text-xl font-bold mb-4">Остальные поля</h2>

                    {/*<Input label="Заголовок" name="title" value={form.title} onChange={handleChange} />*/}
                    <Select label="Расположение" name="location_id" value={form.location_id} options={locations} labelField="city" onChange={handleChange} />
                    <Select label="Ремонт" name="repair_type_id" value={form.repair_type_id} options={repairTypes} onChange={handleChange} />
                    <Select label="Отопление" name="heating_type_id" value={form.heating_type_id} options={heatingTypes} onChange={handleChange} />
                    <Select label="Парковка" name="parking_type_id" value={form.parking_type_id} options={parkingTypes} onChange={handleChange} />
                    <Input label="Телефон владельца" name="owner_phone" value={form.owner_phone} onChange={handleChange} />
                    <Input label="Цена" name="price" type="number" value={form.price} onChange={handleChange} />
                    <Input label="Площадь (общая)" name="total_area" type="number" value={form.total_area} onChange={handleChange} />
                    <Input label="Площадь (жилая)" name="living_area" type="number" value={form.living_area} onChange={handleChange} />
                    <Input label="Этаж" name="floor" type="number" value={form.floor} onChange={handleChange} />
                    <Input label="Всего этажей" name="total_floors" type="number" value={form.total_floors} onChange={handleChange} />
                    <Input label="Год постройки" name="year_built" type="number" value={form.year_built} onChange={handleChange} />
                    <Input label="YouTube" name="youtube_link" value={form.youtube_link} onChange={handleChange} />

                    <div>
                        <label className="block mb-2 text-sm">Фотографии</label>
                        <div className="flex gap-3 flex-wrap">
                            {photoPreviews.map((url, index) => (
                                <div key={index} className="w-24 h-24 border border-[#BAC0CC] border-dashed relative rounded-md overflow-hidden">
                                    <Image src={url} alt="preview" className="object-cover w-full h-full" fill sizes="100px" />
                                    <button type="button" onClick={() => removePhoto(index)} className="absolute top-0 right-0 text-white bg-red-500 rounded-full px-1 py-0.5 text-xs">x</button>
                                </div>
                            ))}
                            <label className="w-24 h-24 border border-[#BAC0CC] border-dashed rounded-md flex items-center justify-center text-3xl cursor-pointer bg-gray-50">
                                +
                                <input type="file" multiple onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <Input label="Описание" name="description" value={form.description} onChange={handleChange} textarea />
                    <button type="submit" className="mt-4 px-6 py-3 bg-[#0036A5] text-white rounded-lg">Сохранить</button>
                </form>
            )}
        </div>
    );
}

// Инпут
interface InputProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    textarea?: boolean;
}

function Input({ label, name, value, onChange, type = 'text', textarea = false }: InputProps) {
    return (
        <div>
            <label className="block mb-2 text-sm">{label}</label>
            {textarea ? (
                <textarea name={name} value={value} onChange={onChange} className="w-full px-4 py-3 rounded-md border border-[#BAC0CC]" rows={4} />
            ) : (
                <input name={name} value={value} type={type} onChange={onChange} className="w-full px-4 py-3 rounded-md border border-[#BAC0CC]" />
            )}
        </div>
    );
}

// Select
interface SelectProps {
    label: string;
    name: string;
    value: string;
    options: SelectOption[];
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    labelField?: keyof SelectOption;
}

function Select({ label, name, value, options, onChange, labelField = 'name' }: SelectProps) {
    return (
        <div>
            <label className="block mb-2 text-sm">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-md border border-[#BAC0CC]"
            >
                <option value="">Выберите из списка</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt[labelField]}
                    </option>
                ))}
            </select>
        </div>
    );
}

interface SelectToggleProps<T extends string | number> {
    title: string;
    options: { id: T; name: string }[];
    selected: T | null;
    setSelected: (val: T) => void;
}

function SelectToggle<T extends string | number>({
                                                     title,
                                                     options,
                                                     selected,
                                                     setSelected,
                                                 }: SelectToggleProps<T>) {
    return (
        <div>
            <h2 className="font-semibold mb-2">{title}</h2>
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        type="button"
                        className={`px-4 py-2 rounded-full border ${
                            selected === opt.id ? 'bg-[#0036A5] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setSelected(opt.id)}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );
}