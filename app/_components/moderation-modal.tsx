'use client';

import { FC, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Property } from '@/services/properties/types';
import { toast } from 'react-toastify';
import { axios } from '@/utils/axios';
import { SelectToggle } from '@/ui-components/SelectToggle';
import {Listing} from "@/app/_components/top-listing/types";

interface ModerationModalProps {
    property: Listing | Property;
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

    // SSR-guard + контейнер для портала
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => setMounted(true), []);

    // Блокируем прокрутку body, пока модалка открыта
    useEffect(() => {
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = overflow;
        };
    }, []);

    // Закрытие по ESC
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload: Partial<Property> = {};
            if (userRole === 'admin') {
                payload.listing_type = selectedListingType;
            }
            if (userRole === 'agent' || userRole === 'admin') {
                payload.moderation_status = selectedModerationStatus;
            }

            const response = await axios.patch(`/properties/${property.id}/moderation-listing`, payload);
            toast.success('Обновлено успешно!');
            onUpdated(response.data?.data ?? payload);
            onClose();
        } catch (error) {
            console.error(error);
            toast.error('Ошибка при обновлении');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return ReactDOM.createPortal(
        // overlay
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]"
            role="dialog"
            aria-modal="true"
            onClick={(e) => { e.stopPropagation(); onClose(); }} // клик по подложке — закрывает
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            {/* панель модалки */}
            <div
                ref={panelRef}
                className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}        // ← ВАЖНО
                onMouseDown={(e) => e.stopPropagation()}    // ← ВАЖНО
                onPointerDown={(e) => e.stopPropagation()}  // ← ВАЖНО
            >
                <h2 className="text-xl font-bold mb-4">Управление объявлением</h2>

                {userRole === 'admin' && (
                    <div className="mb-4">
                        <SelectToggle
                            title="Тип объявления"
                            options={[
                                { id: 'regular', name: 'Обычное' },
                                { id: 'vip', name: 'VIP' },
                                { id: 'urgent', name: 'Срочная продажа' },
                            ]}
                            selected={selectedListingType}
                            setSelected={setSelectedListingType}
                        />
                    </div>
                )}

                {(userRole === 'agent' || userRole === 'admin') && (
                    <div className="mb-4">
                        <SelectToggle
                            title="Статус модерации"
                            options={[
                                { id: 'pending', name: 'На модерации' },
                                { id: 'approved', name: 'Одобрено' },
                                { id: 'rejected', name: 'Отклонено' },
                                { id: 'draft', name: 'Черновик' },
                                { id: 'deleted', name: 'Удалено' },
                                { id: 'sold', name: 'Продано' },
                                { id: 'sold_by_owner', name: 'Продано владельцем' },
                                { id: 'rented', name: 'Арендовано' },
                            ]}
                            selected={selectedModerationStatus}
                            setSelected={setSelectedModerationStatus}
                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        disabled={loading}
                        className="px-4 py-2 rounded bg-[#0036A5] text-white hover:bg-blue-700 transition disabled:opacity-70"
                    >
                        {loading ? 'Сохраняю...' : 'Сохранить'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModerationModal;