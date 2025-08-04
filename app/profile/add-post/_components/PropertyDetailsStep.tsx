'use client';

import { FormEvent, ChangeEvent, useRef, useState } from 'react';
import { Input } from '@/ui-components/Input';
import { Select } from '@/ui-components/Select';
import { PhotoUpload } from '@/ui-components/PhotoUpload';
import { Button } from '@/ui-components/Button';
import { SelectOption, FormState } from '@/services/add-post/types';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';

interface PropertyDetailsStepProps {
  form: FormState;
  locations: SelectOption[];
  repairTypes: SelectOption[];
  heatingTypes: SelectOption[];
  parkingTypes: SelectOption[];
  onSubmit: (e: FormEvent) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onPhotoChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove: (index: number) => void;
  isSubmitting: boolean;
  onBack?: () => void;
}

export function PropertyDetailsStep({
  form,
  locations,
  repairTypes,
  heatingTypes,
  parkingTypes,
  onSubmit,
  onChange,
  onPhotoChange,
  onPhotoRemove,
  isSubmitting,
  onBack,
}: PropertyDetailsStepProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    form.latitude && form.longitude
      ? [parseFloat(form.latitude), parseFloat(form.longitude)]
      : null
  );

  const [addressCaption, setAddressCaption] = useState<string>('');

  const mapRef = useRef(undefined);
  const ymapsRef = useRef(null);

  // eslint-disable-next-line
  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    setCoordinates([coords[0], coords[1]]);

    const latEvent = {
      target: {
        name: 'latitude',
        value: coords[0].toString(),
      },
    };

    const lngEvent = {
      target: {
        name: 'longitude',
        value: coords[1].toString(),
      },
    };

    // eslint-disable-next-line
    onChange(latEvent as any);
    // eslint-disable-next-line
    onChange(lngEvent as any);

    if (ymapsRef.current) {
      try {
        // @ts-expect-error type error disabling
        const geocoder = ymapsRef.current.geocode(coords);
        geocoder
          // eslint-disable-next-line
          .then((res: { geoObjects: { get: (index: number) => any } }) => {
            const firstGeoObject = res.geoObjects.get(0);
            if (firstGeoObject) {
              const address = firstGeoObject.getAddressLine();
              setAddressCaption(address);

              const addressEvent = {
                target: {
                  name: 'address',
                  value: address,
                },
              } as React.ChangeEvent<HTMLInputElement>;

              onChange(addressEvent);

              try {
                const district =
                  firstGeoObject.getAdministrativeAreas()[0] || '';
                if (district) {
                  const districtEvent = {
                    target: {
                      name: 'district',
                      value: district,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;

                  onChange(districtEvent);
                }
              } catch (error) {
                console.log('Could not extract district:', error);
              }
            }
          })
          .catch((error: Error) => {
            console.error('Geocoding error:', error);
          });
      } catch (error) {
        console.error('Error initializing geocoder:', error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <h2 className="text-xl font-bold mb-4 text-[#666F8D]">Детали объекта</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Расположение"
          name="location_id"
          value={form.location_id}
          options={locations}
          labelField="city"
          onChange={onChange}
          required
        />

        <Input
          label="Район"
          name="district"
          value={form.district}
          onChange={onChange}
          type="text"
          placeholder="Сино"
        />

        <Input
          label="Адрес"
          name="address"
          value={form.address}
          onChange={onChange}
          type="text"
          placeholder="Айни 51"
        />

        <Input
          label="Широта"
          name="latitude"
          type="number"
          value={form.latitude}
          onChange={onChange}
          placeholder="1"
          required
          disabled
        />

        <Input
          label="Долгота"
          name="longitude"
          type="number"
          value={form.longitude}
          onChange={onChange}
          placeholder="1"
          required
          disabled
        />

        <Select
          label="Ремонт"
          name="repair_type_id"
          value={form.repair_type_id}
          options={repairTypes}
          onChange={onChange}
        />

        <Select
          label="Отопление"
          name="heating_type_id"
          value={form.heating_type_id}
          options={heatingTypes}
          onChange={onChange}
        />

        <Select
          label="Парковка"
          name="parking_type_id"
          value={form.parking_type_id}
          options={parkingTypes}
          onChange={onChange}
        />

        <Input
          label="Телефон владельца"
          name="owner_phone"
          value={form.owner_phone}
          onChange={onChange}
          type="tel"
          placeholder="+992 XX XXX XX XX"
        />

        <Input
          label="Цена"
          name="price"
          type="number"
          value={form.price}
          onChange={onChange}
          placeholder="0"
          required
        />

        <Input
          label="Площадь (общая)"
          name="total_area"
          type="number"
          value={form.total_area}
          onChange={onChange}
          placeholder="0"
        />

        <Input
          label="Площадь (жилая)"
          name="living_area"
          type="number"
          value={form.living_area}
          onChange={onChange}
          placeholder="0"
        />

        <Input
          label="Этаж"
          name="floor"
          type="number"
          value={form.floor}
          onChange={onChange}
          placeholder="1"
        />

        <Input
          label="Всего этажей"
          name="total_floors"
          type="number"
          value={form.total_floors}
          onChange={onChange}
          placeholder="1"
        />

        <Input
          label="Год постройки"
          name="year_built"
          type="number"
          value={form.year_built}
          onChange={onChange}
          placeholder="2024"
        />

        <Input
          label="YouTube ссылка"
          name="youtube_link"
          value={form.youtube_link}
          onChange={onChange}
          placeholder="https://youtube.com/..."
        />
      </div>

      <PhotoUpload
        photos={form.photos}
        onPhotoChange={onPhotoChange}
        onPhotoRemove={onPhotoRemove}
        className="mt-6"
      />

      <Input
        label="Описание"
        name="description"
        value={form.description}
        onChange={onChange}
        textarea
        placeholder="Подробное описание объекта..."
        className="mt-4"
      />

      <div className="mt-4">
        <label className="block mb-2 text-sm  text-[#666F8D]">
          Расположение на карте (кликните для выбора)
        </label>
        <div className="h-[400px] w-full">
          <YMaps
            query={{
              lang: 'ru_RU',
              apikey: 'dbdc2ae1-bcbd-4f76-ab38-94ca88cf2a6f',
            }}
          >
            <Map
              defaultState={{ center: [38.5597722, 68.7870384], zoom: 9 }}
              width="100%"
              height="100%"
              onClick={handleMapClick}
              instanceRef={mapRef}
              modules={['geocode']}
              onLoad={(ymaps) => {
                // @ts-expect-error type error disabling
                ymapsRef.current = ymaps;
              }}
            >
              {coordinates && (
                <Placemark
                  geometry={coordinates}
                  options={{
                    preset: 'islands#blueHomeIcon',
                    draggable: true,
                  }}
                  properties={{
                    iconCaption: addressCaption || 'Определение адреса...',
                  }}
                />
              )}
            </Map>
          </YMaps>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Точные координаты будут автоматически заполнены при клике на карту
        </p>
      </div>

      <div className="flex justify-between mt-2 flex-col sm:flex-row">
        {onBack && (
          <Button className='mt-4'  type="button" variant="outline" onClick={onBack} size="lg">
            Назад
          </Button>
        )}
          <Button className='mt-4' type="submit" loading={isSubmitting} size="lg">
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
      </div>
    </form>
  );
}
