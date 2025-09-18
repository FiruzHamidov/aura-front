import {axios, call} from '@/services/_shared/http';
import {Agent, CreateUserPayload, UserDto} from "@/services/users/types";
import {AGENT_ENDPOINTS} from "@/services/users/constants";


export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'auth_method'>> & {
    id: number;
};

export type PasswordChangePayload = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

export const usersApi = {
    list: () => call(async () => await axios.get<UserDto[]>('/user')),
    get: (id: number) => call(async () => await axios.get<UserDto>(`/user/${id}`)),
    create: (payload: CreateUserPayload) =>
        call(async () => await axios.post<UserDto>('/user', payload)),
    update: ({id, ...payload}: UpdateUserPayload) =>
        call(async () => await axios.put<UserDto>(`/user/${id}`, payload)),
    remove: (id: number) => call(async () => await axios.delete<{ message: string }>(`/user/${id}`)),

    uploadPhoto: (userId: number, photo: File) =>
        call(async () => {
            const form = new FormData();
            form.append('photo', photo);
            return await axios.post<{ message: string; photo: string }>(`/user/${userId}/photo`, form, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
        }),

    deleteMyPhoto: () =>
        call(async () => await axios.delete<{ message: string }>('/user/photo')),

    changeMyPassword: (payload: PasswordChangePayload) =>
        call(async () => await axios.post<{ message: string }>('/user/password', payload)),

};

export const getAgents = async (): Promise<Agent[]> => {
    const response = await axios.get(AGENT_ENDPOINTS.AGENTS);
    return response.data;
};