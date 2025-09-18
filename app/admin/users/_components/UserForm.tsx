'use client';

import {useEffect, useState} from 'react';
import {Input} from '@/ui-components/Input';
import {toast} from 'react-toastify';
import {useRoles} from '@/services/roles/hooks';
import type {CreateUserPayload, UserDto} from '@/services/users/types';

type Props = {
    mode: 'create' | 'edit';
    initial?: Partial<UserDto>;
    onSubmit: (values: Partial<CreateUserPayload & UserDto>) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
};

export default function UserForm({mode, initial, onSubmit, onCancel, isSubmitting}: Props) {
    const {data: roles} = useRoles();

    const [form, setForm] = useState<Partial<CreateUserPayload & UserDto>>({
        name: '',
        phone: '',
        email: '',
        description: '',
        birthday: '',
        role_id: undefined as unknown as number,
        auth_method: 'password',
        password: '',
        ...initial,
    });

    // для edit пароль не обязателен
    // const showPassword = useMemo(() => form.auth_method === 'password' && mode === 'create', [form.auth_method, mode]);

    useEffect(() => {
        if (initial) setForm((f) => ({...f, ...initial}));
    }, [initial]);

    const updateField = (name: string, value: string) => setForm((f) => ({...f, [name]: value}));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.role_id) {
            toast.error('Заполните имя, телефон и роль');
            return;
        }
        if (mode === 'create' && form.auth_method === 'password' && !form.password) {
            toast.error('Введите пароль (или выберите вход по SMS)');
            return;
        }
        await onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
            <Input label="Имя" name="name" value={form.name || ''} onChange={(e) => updateField('name', e.target.value)}
                   required/>
            <Input label="Телефон" name="phone" value={form.phone || ''}
                   onChange={(e) => updateField('phone', e.target.value)} required/>
            <Input label="Email" type="email" name="email" value={form.email || ''}
                   onChange={(e) => updateField('email', e.target.value)}/>
            <div>
                <label className="block mb-2 text-sm text-gray-600">Дата рождения</label>
                <input
                    type="date"
                    className="w-full px-4 py-3 rounded-md bg-gray-50"
                    value={form.birthday || ''}
                    onChange={(e) => updateField('birthday', e.target.value)}
                />
            </div>
            <Input
                label="Описание"
                name="description"
                value={form.description || ''}
                textarea
                onChange={(e) => updateField('description', e.target.value)}
            />

            <div>
                <label className="block mb-2 text-sm text-gray-600">Роль</label>
                <select
                    className="w-full px-4 py-3 rounded-md bg-gray-50"
                    value={form.role_id ?? ''}
                    onChange={(e) => updateField('role_id', e.target.value)}
                    required
                >
                    <option value="" disabled>Выберите роль</option>
                    {roles?.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
            </div>

            <Input
                label="Пароль"
                type="password"
                name="password"
                value={form.password || ''}
                onChange={(e) => updateField('password', e.target.value)}
            />

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md bg-[#0036A5] text-white disabled:opacity-60"
                >
                    {isSubmitting ? 'Сохранение…' : 'Сохранить'}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">
                    Отмена
                </button>
            </div>
        </form>
    );
}