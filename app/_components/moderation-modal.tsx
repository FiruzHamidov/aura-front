'use client';

import {FC, useState} from 'react';
import {Property} from '@/services/properties/types';


import {toast} from 'react-toastify';
import {axios} from "@/utils/axios";
import {SelectToggle} from "@/ui-components/SelectToggle";

interface ModerationModalProps {
    property: Property;
    onClose: () => void;
    onUpdated: (updated: Partial<Property>) => void;
    userRole: 'admin' | 'agent';
}

const ModerationModal: FC<ModerationModalProps> = ({
                                                       property,
                                                       onClose,
                                                       onUpdated,
                                                       userRole,
                                                   }) => {
    const [selectedListingType, setSelectedListingType] = useState(property.listing_type);
    const [selectedModerationStatus, setSelectedModerationStatus] = useState(property.moderation_status);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload: Partial<Property> = {};
            if (userRole === 'admin') {
                payload.listing_type = selectedListingType;
            }
            if (userRole === 'agent') {
                payload.moderation_status = selectedModerationStatus;
            }

            const response = await axios.patch(`/api/properties/${property.id}/moderation-listing`, payload);
            toast.success('Обновлено успешно!');
            onUpdated(response.data.data); // или просто payload
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при обновлении');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">Управление объявлением</h2>

                {userRole === 'admin' && (
                    <div className="mb-4">
                        <SelectToggle
                            title="Тип объявления"
                            options={[
                                {id: 'regular', name: 'Обычное'},
                                {id: 'vip', name: 'VIP'},
                                {id: 'urgent', name: 'Срочная продажа'},
                            ]}
                            selected={selectedListingType}
                            setSelected={setSelectedListingType}
                        />
                    </div>
                )}

                {userRole === 'agent' || userRole === 'admin' && (
                    <div className="mb-4">
                        <SelectToggle
                            title="Статус модерации"
                            options={[
                                {id: 'pending', name: 'На модерации'},
                                {id: 'approved', name: 'Одобрено'},
                                {id: 'rejected', name: 'Отклонено'},
                                {id: 'draft', name: 'Черновик'},
                                {id: 'deleted', name: 'Удалено'},
                            ]}
                            selected={selectedModerationStatus}
                            setSelected={setSelectedModerationStatus}
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        {loading ? 'Сохраняю...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModerationModal;