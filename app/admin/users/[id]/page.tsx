'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUser, useUpdateUser, useDeleteUser } from '@/services/users/hooks';
import UserForm from '../_components/UserForm';
import { toast } from 'react-toastify';
import type { UpdateUserPayload, UserDto } from '@/services/users/types';

export default function UserDetails() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: user, isLoading, error } = useUser(Number(id));
    const upd = useUpdateUser();
    const del = useDeleteUser();

    if (isLoading) return <div className="p-6">Загрузка…</div>;
    if (error || !user) return <div className="p-6 text-red-500">Ошибка или не найден</div>;

    const onSubmit = async (values: Partial<UserDto>) => {
        try {
            const payload: UpdateUserPayload = {
                id: user.id,
                name: values.name,
                phone: values.phone,
                email: values.email,
                description: values.description,
                birthday: values.birthday,
                role_id: values.role_id,
            };
            await upd.mutateAsync(payload);
            toast.success('Сохранено');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Ошибка');
            }
        }
    };

    const onDelete = async () => {
        const ok = confirm('Удалить пользователя?');
        if (!ok) return;
        try {
            await del.mutateAsync(user.id);
            router.push('/admin/users');
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error('Ошибка удаления');
            }
        }
    };

    return (
        <div className="p-6 w-full rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Пользователь #{user.id}</h1>
                <button
                    className="px-3 py-1 rounded-md border border-red-300 text-red-600"
                    onClick={onDelete}
                >
                    Удалить
                </button>
            </div>
            <UserForm
                mode="edit"
                initial={user}
                onSubmit={onSubmit}
                onCancel={() => history.back()}
                isSubmitting={upd.isPending}
            />
        </div>
    );
}