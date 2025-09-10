'use client';

import { useEffect, useMemo, useState } from 'react';
import { BankOption } from './BankOption';
import { MortgageResults } from './MortgageResults';
import { DateInput } from '@/ui-components/DateInput';
import { FormInput } from '@/ui-components/FormInput';
import { SelectInput } from '@/ui-components/SelectInput';
import MortgageRequestModal, { MortgageRequestPayload } from './MortgageRequestModal';

const parseMoney = (v: string | number | undefined | null) => {
    if (v === null || v === undefined) return 0;
    const s = String(v).replace(/[^\d.,]/g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
};
const formatMoney = (n: number) =>
    new Intl.NumberFormat('ru-RU').format(Math.max(0, Math.round(n)));

type PaymentType = 'annuity' | 'differentiated';
type Frequency = 'monthly' | 'weekly';

interface MortgageCalculatorProps {
    id?: string;
    propertyPrice?: number | string; // можно прокинуть снаружи
}

export default function MortgageCalculator({ id, propertyPrice: propPrice }: MortgageCalculatorProps) {
    const initialPrice = useMemo(
        () => (propPrice !== undefined ? parseMoney(propPrice) : parseMoney('450 000')),
        [propPrice]
    );

    const [propertyPrice, setPropertyPrice] = useState<string>(formatMoney(initialPrice));
    const [interestRate, setInterestRate] = useState<string>('19');
    const [loanTerm, setLoanTerm] = useState<string>('3');
    const [startDate, setStartDate] = useState<string>('07.03.2022');
    const [paymentType, setPaymentType] = useState<PaymentType>('annuity');
    const [paymentFrequency, setPaymentFrequency] = useState<Frequency>('monthly');
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setPropertyPrice(formatMoney(initialPrice));
    }, [initialPrice]);

    const calc = useMemo(() => {
        const P = parseMoney(propertyPrice);
        const annual = Number(String(interestRate).replace(',', '.')) || 0;
        const years = Number(loanTerm) || 0;

        const periods = paymentFrequency === 'monthly' ? 12 : 52;
        const n = Math.max(1, Math.round(years * periods));
        const r = annual / 100 / periods;

        let payment = 0;
        let totalInterest = 0;

        if (P <= 0 || annual < 0 || years <= 0) {
            return {
                propertyPrice: `${formatMoney(P)} с.`,
                interestRate: `${annual}%`,
                totalInterest: `0 с.`,
                monthlyPayment: `0 с.`,
            };
        }

        if (paymentType === 'annuity') {
            if (r === 0) {
                payment = P / n;
                totalInterest = 0;
            } else {
                payment = (P * r) / (1 - Math.pow(1 + r, -n));
                totalInterest = payment * n - P;
            }
        } else {
            const principalPerPeriod = P / n;
            totalInterest = (P * r * (n + 1)) / 2;
            const firstInterest = P * r;
            payment = principalPerPeriod + firstInterest;
        }

        return {
            propertyPrice: `${formatMoney(P)} с.`,
            interestRate: `${annual}%`,
            totalInterest: `${formatMoney(totalInterest)} с.`,
            monthlyPayment: `${formatMoney(payment)} с.`,
        };
    }, [propertyPrice, interestRate, loanTerm, paymentType, paymentFrequency]);

    const modalPayload: MortgageRequestPayload = {
        propertyPrice: parseMoney(propertyPrice),
        interestRate: Number(interestRate) || 0,
        loanTermYears: Number(loanTerm) || 0,
        paymentType,
        paymentFrequency,
        startDate,
        selectedBank,
    };

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-6 mt-10" id={id}>
                <div className="lg:w-3/4 bg-white rounded-[22px] px-4 py-5 md:px-[30px] md:pt-[35px] md:pb-[55px]">
                    <h2 className="text-2xl md:text-[32px] font-bold mb-6 md:mb-12">Ипотека от банков</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] gap-y-[22px]">
                        <FormInput
                            label="Стоимость недвижимости"
                            value={propertyPrice}
                            onChange={(value) => setPropertyPrice(formatMoney(parseMoney(value)))}
                            suffix="с."
                        />

                        <FormInput
                            label="Процентная ставка"
                            value={interestRate}
                            onChange={(value) => setInterestRate(String(value).replace(',', '.'))}
                            suffix="%"
                        />

                        <SelectInput
                            label="Срок ипотеки"
                            value={loanTerm}
                            onChange={(value) => setLoanTerm(value)}
                            suffix="года"
                            options={[
                                { id: '1', name: '1 год' },
                                { id: '2', name: '2 года' },
                                { id: '3', name: '3 года' },
                                { id: '4', name: '4 года' },
                                { id: '5', name: '5 лет' },
                                { id: '6', name: '6 лет' },
                                { id: '7', name: '7 лет' },
                                { id: '8', name: '8 лет' },
                                { id: '9', name: '9 лет' },
                                { id: '10', name: '10 лет' },
                                { id: '11', name: '11 лет' },
                                { id: '12', name: '12 лет' },
                                { id: '13', name: '13 лет' },
                                { id: '14', name: '14 лет' },
                                { id: '15', name: '15 лет' },
                                { id: '16', name: '16 лет' },
                                { id: '17', name: '17 лет' },
                                { id: '18', name: '18 лет' },
                                { id: '19', name: '19 лет' },
                                { id: '20', name: '20 лет' },
                                { id: '21', name: '21 лет' },
                                { id: '22', name: '22 лет' },
                                { id: '23', name: '23 лет' },
                                { id: '24', name: '24 лет' },
                                { id: '25', name: '25 лет' },
                            ]}
                        />

                        <DateInput label="Дата выдачи" value={startDate} onChange={(value) => setStartDate(value)} />

                        <SelectInput
                            label="Порядок погашения"
                            value={paymentType}
                            onChange={(value) => setPaymentType((value as PaymentType) || 'annuity')}
                            options={[
                                { id: 'annuity', name: 'Аннуитетный' },
                                { id: 'differentiated', name: 'Дифференцированный' },
                            ]}
                        />

                        <SelectInput
                            label="Периодичность погашения"
                            value={paymentFrequency}
                            onChange={(value) => setPaymentFrequency((value as Frequency) || 'monthly')}
                            options={[
                                { id: 'monthly', name: 'Ежемесячно' },
                                { id: 'weekly', name: 'Еженедельно' },
                            ]}
                        />
                    </div>

                    <p className="text-gray-500 text-sm mt-6 mb-8">
                        Все расчеты являются предварительными и могут отличаться от фактически полученных
                    </p>

                    <div>
                        <h3 className="text-2xl md:text-[32px] font-bold mb-[22px]">Выбрать банк</h3>
                        <div className="flex flex-wrap gap-5">
                            <BankOption
                                name="alif"
                                logo="/images/banks/alif.png"
                                isSelected={selectedBank === 'alif'}
                                onSelect={() => setSelectedBank('alif')}
                            />
                            <BankOption
                                name="eskhata"
                                logo="/images/banks/eskhata.png"
                                isSelected={selectedBank === 'eskhata'}
                                onSelect={() => setSelectedBank('eskhata')}
                            />
                            <BankOption
                                name="ibt"
                                logo="/images/banks/ibt.png"
                                isSelected={selectedBank === 'ibt'}
                                onSelect={() => setSelectedBank('ibt')}
                            />
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/4">
                    <MortgageResults
                        {...calc}
                        onRequestClick={() => setOpenModal(true)} // КЛИК внутри этого компонента
                    />
                </div>
            </div>

            <MortgageRequestModal open={openModal} onClose={() => setOpenModal(false)} payload={modalPayload} />
        </>
    );
}