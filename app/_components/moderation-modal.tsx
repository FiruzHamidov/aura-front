'use client';

import { useGetAgentsQuery } from '@/services/users/hooks';

import {FC, useEffect, useState, ChangeEvent} from 'react';
import ReactDOM from 'react-dom';
import {Property} from '@/services/properties/types';
import {toast} from 'react-toastify';
import {axios} from '@/utils/axios';
import {SelectToggle} from '@/ui-components/SelectToggle';
import {Listing} from "@/app/_components/top-listing/types";
import SafeHtml from "@/app/profile/edit-post/[id]/_components/SafeHtml";
import {UpdateModerationAndDealPayload} from "@/services/properties/deal";

interface ModerationModalProps {
    property: Listing | Property;
    onClose: () => void;
    onUpdated: (updated: Partial<Property>) => void;
    userRole: 'admin' | 'agent';
}

const STATUS_REQUIRING_COMMENT = ['sold', 'sold_by_owner', 'rented', 'denied', 'deleted'];
const STATUS_REQUIRING_DEAL = ['sold', 'sold_by_owner', 'rented'];

const ModerationModal: FC<ModerationModalProps> = ({
                                                       property,
                                                       onClose,
                                                       onUpdated,
                                                       userRole,
                                                   }) => {
    const [selectedListingType, setSelectedListingType] = useState(property.listing_type);
    const [selectedModerationStatus, setSelectedModerationStatus] = useState(property.moderation_status);
    const [statusComment, setStatusComment] = useState<string>((property as any).status_comment ?? '');
    const [actualSalePrice, setActualSalePrice] = useState('');
    const [companyCommission, setCompanyCommission] = useState('');
    const [moneyHolder, setMoneyHolder] = useState<string | ''>('');
    const [loading, setLoading] = useState(false);

    const { data: agents = [], isLoading: agentsLoading } = useGetAgentsQuery();

    const [selectedAgents, setSelectedAgents] = useState<
        Array<{
            agent_id: number;
            role: 'main' | 'assistant' | 'partner';
            commission_amount?: string;
        }>
    >([]);

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
    const mustProvideDeal = STATUS_REQUIRING_DEAL.includes(selectedModerationStatus);

    useEffect(() => {
        if (!mustProvideDeal) {
            setActualSalePrice('');
            setCompanyCommission('');
            setMoneyHolder('');
        }
    }, [mustProvideDeal]);

    const handleSave = async () => {
        // клиентская валидация: если выбран статус, требующий комментарий — проверяем
        if (mustProvideComment && (!statusComment || statusComment.trim() === '')) {
            toast.error('Требуется комментарий при смене статуса.');
            return;
        }

        if (mustProvideDeal) {
            if (!actualSalePrice || Number(actualSalePrice) <= 0) {
                toast.error('Укажите фактическую сумму сделки');
                return;
            }

            if (!companyCommission || Number(companyCommission) < 0) {
                toast.error('Укажите комиссию компании (0 если без комиссии)');
                return;
            }

            if (!moneyHolder) {
                toast.error('Укажите, у кого находятся деньги');
                return;
            }

            if (selectedModerationStatus === 'sold' && selectedAgents.length === 0) {
                toast.error('Укажите хотя бы одного агента, участвующего в продаже');
                return;
            }
        }

        setLoading(true);
        try {
            const payload: UpdateModerationAndDealPayload = {
                moderation_status: selectedModerationStatus,
            };

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

            if (mustProvideDeal) {
                payload.actual_sale_price = Number(actualSalePrice);
                payload.actual_sale_currency = property.actual_sale_currency ?? 'TJS';

                payload.company_commission_amount = Number(companyCommission);
                payload.company_commission_currency = property.company_commission_currency ?? 'TJS';

                payload.money_holder = moneyHolder as any;

                payload.money_received_at = property.money_received_at ?? '';
                payload.contract_signed_at = property.contract_signed_at ?? '';

                payload.deposit_amount = property.deposit_amount ?? 0;
                payload.deposit_currency = property.deposit_currency ?? 'TJS';
                payload.deposit_received_at = property.deposit_received_at ?? '';
                payload.deposit_taken_at = property.deposit_taken_at ?? '';

                if (selectedModerationStatus === 'sold') {
                    payload.agents = selectedAgents.map(a => ({
                        agent_id: a.agent_id,
                        role: a.role,
                        commission_amount: a.commission_amount
                            ? Number(a.commission_amount)
                            : null,
                    }));
                }
            }

            const response = await axios.patch(
                `/properties/${property.id}/moderation-and-listing-type`,
                payload
            );
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
                className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
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

                {mustProvideDeal && (
                    <div className="mb-4 border rounded-xl p-4 bg-gray-50">
                        <h3 className="font-semibold mb-3">Данные сделки (обязательно)</h3>

                        <div className="mb-3">
                            <label className="block text-sm mb-1 font-medium">
                                Фактическая сумма сделки <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={actualSalePrice}
                                onChange={(e) => setActualSalePrice(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                placeholder="Например: 85000"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm mb-1 font-medium">
                                Комиссия компании <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={companyCommission}
                                onChange={(e) => setCompanyCommission(e.target.value)}
                                className="w-full border rounded-lg p-2"
                                placeholder="Например: 3000"
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm mb-1 font-medium">
                                У кого находятся деньги <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={moneyHolder}
                                onChange={(e) => setMoneyHolder(e.target.value)}
                                className="w-full border rounded-lg p-2"
                            >
                                <option value="">— выберите —</option>
                                <option value="company">Компания</option>
                                <option value="agent">Агент</option>
                                <option value="owner">Владелец</option>
                                <option value="developer">Застройщик</option>
                                <option value="client">Клиент</option>
                            </select>
                        </div>

                        {selectedModerationStatus === 'sold' && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">
                                    Агенты, участвующие в продаже <span className="text-red-500">*</span>
                                </label>

                                {agentsLoading ? (
                                    <p className="text-sm text-gray-500">Загрузка агентов...</p>
                                ) : (
                                    <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2 bg-white">
                                        {agents.map((agent: any) => {
                                            const selected = selectedAgents.find(a => a.agent_id === agent.id);

                                            return (
                                                <div key={agent.id} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selected}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedAgents(prev => [
                                                                    ...prev,
                                                                    { agent_id: agent.id, role: 'assistant' },
                                                                ]);
                                                            } else {
                                                                setSelectedAgents(prev =>
                                                                    prev.filter(a => a.agent_id !== agent.id)
                                                                );
                                                            }
                                                        }}
                                                    />

                                                    <span className="flex-1">
                                                        {agent.name ?? agent.email}
                                                    </span>

                                                    {selected && (
                                                        <>
                                                            <select
                                                                value={selected.role}
                                                                onChange={(e) =>
                                                                    setSelectedAgents(prev =>
                                                                        prev.map(a =>
                                                                            a.agent_id === agent.id
                                                                                ? { ...a, role: e.target.value as any }
                                                                                : a
                                                                        )
                                                                    )
                                                                }
                                                                className="border rounded px-1 py-0.5"
                                                            >
                                                                <option value="main">Главный</option>
                                                                <option value="assistant">Помощник</option>
                                                                <option value="partner">Партнёр</option>
                                                            </select>

                                                            <input
                                                                type="number"
                                                                placeholder="Комиссия"
                                                                value={selected.commission_amount ?? ''}
                                                                onChange={(e) =>
                                                                    setSelectedAgents(prev =>
                                                                        prev.map(a =>
                                                                            a.agent_id === agent.id
                                                                                ? { ...a, commission_amount: e.target.value }
                                                                                : a
                                                                        )
                                                                    )
                                                                }
                                                                className="w-24 border rounded px-2 py-0.5"
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
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