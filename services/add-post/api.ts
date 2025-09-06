// services/add-post/api.ts
// Клиент на axios, поддерживает и FormData, и JSON payload’ы.
// Встроены комменты к tricky местам.

import { axios } from '@/utils/axios';
import type {
  BuildingType,
  ContractType,
  CreatePropertyPayload,
  CreatePropertyRequest,
  CreatePropertyResponse,
  HeatingType,
  Location,
  ParkingType,
  PropertyType,
  RepairType,
  UpdatePropertyPayload,
} from './types';

const ADD_POST_ENDPOINTS = {
  GET_PROPERTY_TYPES: '/property-types',
  GET_BUILDING_TYPES: '/building-types',
  GET_LOCATIONS: '/locations',
  GET_REPAIR_TYPES: '/repair-types',
  GET_HEATING_TYPES: '/heating-types',
  GET_PARKING_TYPES: '/parking-types',
  GET_CONTRACT_TYPES: '/contract-types',
  CREATE_PROPERTY: '/properties',
} as const;

const appendIfFilled = (fd: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null) return;
  if (typeof value === 'string' && value !== '') fd.append(key, value);
  else if (typeof value === 'number') fd.append(key, String(value));
  else if (typeof value === 'boolean') fd.append(key, value ? '1' : '0');
};

const buildFormDataFromJson = (payload: CreatePropertyRequest) => {
  const fd = new FormData();

  appendIfFilled(fd, 'description', payload.description);
  appendIfFilled(fd, 'type_id', payload.type_id);
  appendIfFilled(fd, 'status_id', payload.status_id);
  appendIfFilled(fd, 'location_id', payload.location_id);
  appendIfFilled(fd, 'moderation_status', payload.moderation_status);
  appendIfFilled(fd, 'repair_type_id', payload.repair_type_id);
  appendIfFilled(fd, 'district', payload.district);
  appendIfFilled(fd, 'address', payload.address);
  appendIfFilled(fd, 'heating_type_id', payload.heating_type_id);
  appendIfFilled(fd, 'contract_type_id', payload.contract_type_id);
  appendIfFilled(fd, 'parking_type_id', payload.parking_type_id);
  appendIfFilled(fd, 'price', payload.price);
  appendIfFilled(fd, 'currency', payload.currency);
  appendIfFilled(fd, 'offer_type', payload.offer_type);
  appendIfFilled(fd, 'listing_type', payload.listing_type);
  appendIfFilled(fd, 'rooms', payload.rooms);
  appendIfFilled(fd, 'total_area', payload.total_area);
  appendIfFilled(fd, 'living_area', payload.living_area);
  appendIfFilled(fd, 'floor', payload.floor);
  appendIfFilled(fd, 'total_floors', payload.total_floors);
  appendIfFilled(fd, 'year_built', payload.year_built);
  appendIfFilled(fd, 'condition', payload.condition);
  appendIfFilled(fd, 'apartment_type', payload.apartment_type);
  appendIfFilled(fd, 'has_garden', payload.has_garden);
  appendIfFilled(fd, 'has_parking', payload.has_parking);
  appendIfFilled(fd, 'is_mortgage_available', payload.is_mortgage_available);
  appendIfFilled(fd, 'is_from_developer', payload.is_from_developer);
  // appendIfFilled(fd, 'has_garden', "false");
  // appendIfFilled(fd, 'has_parking', "false");
  // appendIfFilled(fd, 'is_mortgage_available', "false");
  // appendIfFilled(fd, 'is_from_developer', "false");
  appendIfFilled(fd, 'landmark', payload.landmark);

  // Опциональные
  appendIfFilled(fd, 'owner_phone', payload.owner_phone);
  appendIfFilled(fd, 'youtube_link', payload.youtube_link);
  appendIfFilled(fd, 'latitude', payload.latitude);
  appendIfFilled(fd, 'longitude', payload.longitude);
  appendIfFilled(fd, 'agent_id', payload.agent_id);

  // Новые фото (если есть)
  (payload.photos ?? []).forEach((file) => {
    fd.append('photos[]', file);
  });

  // Управление существующими фото (если используется на апдейте JSON->multipart)
  (payload.photos_keep ?? []).forEach((id) => fd.append('photos_keep[]', String(id)));
  (payload.remove_ids ?? []).forEach((id) => fd.append('remove_ids[]', String(id)));
  if (payload.cover_id) fd.append('cover_id', String(payload.cover_id));

  return fd;
};

export const addPostApi = {
  // --------- справочники ----------
  getPropertyTypes: async (): Promise<PropertyType[]> => {
    const { data } = await axios.get<PropertyType[]>(ADD_POST_ENDPOINTS.GET_PROPERTY_TYPES);
    return data;
  },
  getBuildingTypes: async (): Promise<BuildingType[]> => {
    const { data } = await axios.get<BuildingType[]>(ADD_POST_ENDPOINTS.GET_BUILDING_TYPES);
    return data;
  },
  getLocations: async (): Promise<Location[]> => {
    const { data } = await axios.get<Location[]>(ADD_POST_ENDPOINTS.GET_LOCATIONS);
    return data;
  },
  getRepairTypes: async (): Promise<RepairType[]> => {
    const { data } = await axios.get<RepairType[]>(ADD_POST_ENDPOINTS.GET_REPAIR_TYPES);
    return data;
  },
  getHeatingTypes: async (): Promise<HeatingType[]> => {
    const { data } = await axios.get<HeatingType[]>(ADD_POST_ENDPOINTS.GET_HEATING_TYPES);
    return data;
  },
  getParkingTypes: async (): Promise<ParkingType[]> => {
    const { data } = await axios.get<ParkingType[]>(ADD_POST_ENDPOINTS.GET_PARKING_TYPES);
    return data;
  },
  getContractTypes: async (): Promise<ContractType[]> => {
    const { data } = await axios.get<ContractType[]>(ADD_POST_ENDPOINTS.GET_CONTRACT_TYPES);
    return data;
  },

  // --------- CREATE ----------
  // Принимаем union: FormData | CreatePropertyRequest
  async createProperty(payload: CreatePropertyPayload): Promise<CreatePropertyResponse> {
    // Если пришёл FormData — шлём как есть (браузер сам проставит boundary)
    if (payload instanceof FormData) {
      const { data } = await axios.post<CreatePropertyResponse>(
          ADD_POST_ENDPOINTS.CREATE_PROPERTY,
          payload,
          { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    }

    // Если пришёл JSON — конвертируем в FormData (так проще поддерживать файлы)
    const fd = buildFormDataFromJson(payload);
    const { data } = await axios.post<CreatePropertyResponse>(
        ADD_POST_ENDPOINTS.CREATE_PROPERTY,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  // --------- UPDATE ----------
  // Две ветки: multipart (formData) или JSON-патч
  async updateProperty(payload: UpdatePropertyPayload): Promise<CreatePropertyResponse> {
    const { id } = payload;

    if ('formData' in payload) {
      const fd = payload.formData;

      // Для Laravel обычно стабильнее PATCH как POST + _method=PATCH
      if (!fd.has('_method')) fd.append('_method', 'PATCH');

      const { data } = await axios.post<CreatePropertyResponse>(
          `${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${id}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return data;
    }

    // JSON-патч (без файлов)
    const { data } = await axios.patch<CreatePropertyResponse>(
        `${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${id}`,
        payload.json
    );
    return data;
  },
};