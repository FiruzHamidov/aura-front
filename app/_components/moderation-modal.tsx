'use client';

import {FC, useEffect, useState, ChangeEvent} from 'react';
import ReactDOM from 'react-dom';
import {Property} from '@/services/properties/types';
import {toast} from 'react-toastify';
import {axios} from '@/utils/axios';
import {SelectToggle} from '@/ui-components/SelectToggle';
import {Listing} from "@/app/_components/top-listing/types";
import SafeHtml from "@/app/profile/edit-post/[id]/_components/SafeHtml";

interface ModerationModalProps {
    property: Listing | Property;
    onClose: () => void;
    onUpdated: (updated: Partial<Property>) => void;
    userRole: 'admin' | 'agent';
}

const STATUS_REQUIRING_COMMENT = ['sold', 'sold_by_owner', 'rented', 'denied', 'deleted'];

const ModerationModal: FC<ModerationModalProps> = ({
                                                       property,
                                                       onClose,
                                                       onUpdated,
                                                       userRole,
                                                   }) => {
    const [selectedListingType, setSelectedListingType] = useState(property.listing_type);
    const [selectedModerationStatus, setSelectedModerationStatus] = useState(property.moderation_status);
    const [statusComment, setStatusComment] = useState<string>((property as any).status_comment ?? '');
    const [loading, setLoading] = useState(false);

    // признак “vip/urgent”
    const isPromo = selectedListingType === 'vip' || selectedListingType === 'urgent';

    // если агент и объявление vip/urgent → запрет approved (и автосброс в pending)
    useEffect(() => {
        if (userRole === 'agent' && isPromo && selectedModerationStatus === 'approved') {
            setSelectedModerationStatus('pending');
        }
    }, [userRole, isPromo, selectedModerationStatus]);

    const moderationOptions = ((): { id: string; name: string }[] => {
        const offerType = property.offer_type

        const base = [
            {id: 'pending', name: 'На модерации'},
            {id: 'approved', name: 'Одобрено'},
            // {id: 'rejected', name: 'Отклонено'},
            // {id: 'draft', name: 'Черновик'},
            {id: 'sold', name: 'Продано агентом'},
            {id: 'sold_by_owner', name: 'Продано владельцем'},
            {id: 'rented', name: 'Арендовано'},
            {id: 'denied', name: 'Отказано клиентом'},
        ];

        // Добавляем 'deleted' только для админа
        if (userRole === 'admin') {
            base.push({id: 'deleted', name: 'Удалено'});
        }

        // агент + vip/urgent → убираем approved из списка
        if (userRole === 'agent' && isPromo) {
            return base.filter(o => o.id !== 'approved');
        }

        // Фильтрация по типу оффера: если аренда — убираем статусы про продажу; если продажа — убираем статусы про аренду
        let list = base.slice();
        if (offerType === 'rent') {
            list = list.filter(s => s.id !== 'sold' && s.id !== 'sold_by_owner');
        } else if (offerType === 'sale') {
            list = list.filter(s => s.id !== 'rented');
        }

        return list;
    })();

    useEffect(() => {
        if (userRole === 'agent' && isPromo && selectedModerationStatus === 'approved') {
            setSelectedModerationStatus('pending');
        }
    }, [userRole, isPromo, selectedModerationStatus]);

    const mustProvideComment = STATUS_REQUIRING_COMMENT.includes(selectedModerationStatus);

    const handleSave = async () => {
        // клиентская валидация: если выбран статус, требующий комментарий — проверяем
        if (mustProvideComment && (!statusComment || statusComment.trim() === '')) {
            toast.error('Требуется комментарий при смене статуса.');
            return;
        }

        setLoading(true);
        try {
            const payload: Partial<Property> = {};

            // админ может менять listing_type
            if (userRole === 'admin') {
                payload.listing_type = selectedListingType;
            }

            // оба (agent/admin) могут менять модерацию, но для агента с promo принудительно ставим pending
            if (userRole === 'agent' || userRole === 'admin') {
                let nextStatus = selectedModerationStatus;

                // ВАЖНО: если агент и (vip/urgent), то серверу отправляем только pending
                const effectiveListingType =
                    userRole === 'admin' ? selectedListingType : property.listing_type; // агент не меняет listing_type в UI
                const promoForAgent =
                    userRole === 'agent' && (effectiveListingType === 'vip' || effectiveListingType === 'urgent');

                if (promoForAgent) {
                    nextStatus = 'pending';
                }
                payload.moderation_status = nextStatus;
            }

            // отправляем комментарий если он есть или если выбран требующий комментарий статус
            if (statusComment && statusComment.trim() !== '') {
                payload.status_comment = statusComment.trim();
            } else if (mustProvideComment) {
                // сюда мы не должны попасть из-за проверки выше, но оставим на всякий случай
                payload.status_comment = '';
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

    // ...ниже JSX
    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Управление объявлением</h2>

                {(userRole === 'agent' || userRole === 'admin') && (
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

                {(userRole === 'agent' || userRole === 'admin') && (
                    <div className="mb-4">
                        <SelectToggle
                            title="Статус модерации"
                            options={moderationOptions}
                            selected={selectedModerationStatus}
                            setSelected={setSelectedModerationStatus}
                            disabled={userRole === 'agent' && isPromo}
                        />
                        {/* Подсказка для агента при vip/urgent */}
                        {userRole === 'agent' && isPromo && (
                            <p className="text-xs text-amber-600 mt-2">
                                Для VIP/Срочной продажи у агентов статус публикации всегда «На модерации».
                            </p>
                        )}
                    </div>
                )}

                <div className='mb-4'>
                    <SafeHtml html={property.rejection_comment} className="prose text-sm p-4 border rounded-2xl" />
                </div>

                {/* Новое поле комментария статуса — показывается когда выбран статус, требующий комментарий */}
                {mustProvideComment && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Причина смены статуса (обязательно)</label>
                        <textarea
                            value={statusComment}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setStatusComment(e.target.value)}
                            rows={4}
                            className="w-full p-3 border rounded-lg text-sm"
                            placeholder="Напишите причину изменения статуса..."
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