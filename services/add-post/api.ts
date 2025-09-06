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
  appendIfFilled(fd, 'landmark', payload.landmark);

  appendIfFilled(fd, 'owner_phone', payload.owner_phone);
  appendIfFilled(fd, 'youtube_link', payload.youtube_link);
  appendIfFilled(fd, 'latitude', payload.latitude);
  appendIfFilled(fd, 'longitude', payload.longitude);
  appendIfFilled(fd, 'agent_id', payload.agent_id);

  (payload.photos ?? []).forEach((file) => fd.append('photos[]', file));
  (payload.photos_keep ?? []).forEach((id) => fd.append('photos_keep[]', String(id)));
  (payload.remove_ids ?? []).forEach((id) => fd.append('remove_ids[]', String(id)));
  if (payload.cover_id) fd.append('cover_id', String(payload.cover_id));

  return fd;
};

export const addPostApi = {
  // ---- справочники ----
  getPropertyTypes: async (): Promise<PropertyType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_PROPERTY_TYPES)).data,
  getBuildingTypes: async (): Promise<BuildingType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_BUILDING_TYPES)).data,
  getLocations: async (): Promise<Location[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_LOCATIONS)).data,
  getRepairTypes: async (): Promise<RepairType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_REPAIR_TYPES)).data,
  getHeatingTypes: async (): Promise<HeatingType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_HEATING_TYPES)).data,
  getParkingTypes: async (): Promise<ParkingType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_PARKING_TYPES)).data,
  getContractTypes: async (): Promise<ContractType[]> => (await axios.get(ADD_POST_ENDPOINTS.GET_CONTRACT_TYPES)).data,

  // ---- create ----
  async createProperty(payload: CreatePropertyPayload): Promise<CreatePropertyResponse> {
    if (payload instanceof FormData) {
      return (await axios.post(ADD_POST_ENDPOINTS.CREATE_PROPERTY, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })).data;
    }
    const fd = buildFormDataFromJson(payload);
    return (await axios.post(ADD_POST_ENDPOINTS.CREATE_PROPERTY, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data;
  },

  // ---- update ----
  async updateProperty(payload: UpdatePropertyPayload): Promise<CreatePropertyResponse> {
    const { id } = payload;
    if ('formData' in payload) {
      const fd = payload.formData;
      if (!fd.has('_method')) fd.append('_method', 'PUT');
      return (await axios.post(`${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })).data;
    }
    return (await axios.put(`${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${id}`, payload.json)).data;
  },

  // ---- reorder photos (ВЫНЕСЕНО СЮДА) ----
  async reorderPhotos(propertyId: number | string, orderedPhotoIds: number[]): Promise<void> {
    await axios.put(`${ADD_POST_ENDPOINTS.CREATE_PROPERTY}/${propertyId}/photos/reorder`, {
      photo_order: orderedPhotoIds,
    });
  },
};