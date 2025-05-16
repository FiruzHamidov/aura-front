'use client';

import { useState } from 'react';
import { FormInput } from './FormInput';
import { BankOption } from './BankOption';
import { DateInput } from './DateInput';
import { MortgageResults } from './MortgageResults';
import { SelectInput } from './SelectInput';

export default function MortgageCalculator() {
  const [propertyPrice, setPropertyPrice] = useState('450 000');
  const [interestRate, setInterestRate] = useState('19');
  const [loanTerm, setLoanTerm] = useState('3');
  const [startDate, setStartDate] = useState('07.03.2022');
  const [paymentType, setPaymentType] = useState('Аннуитетный');
  const [paymentFrequency, setPaymentFrequency] = useState('Ежемесячно');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  // Mock calculation results - in a real app this would be calculated based on inputs
  const calculationResults = {
    propertyPrice: '450 000 с.',
    interestRate: '22%',
    totalInterest: '280 272 с.',
    monthlyPayment: '5 333 с.',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-10">
      <div className="lg:w-3/4 bg-white rounded-[22px] px-[30px] pt-[35px] pb-[55px]">
        <h2 className="text-[32px] font-bold mb-12">Ипотека от банков</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] gap-y-[22px]">
          <FormInput
            label="Стоимость недвижимости"
            value={propertyPrice}
            onChange={(value) => setPropertyPrice(value)}
            suffix="с."
          />

          <FormInput
            label="Процентная ставка"
            value={interestRate}
            onChange={(value) => setInterestRate(value)}
            suffix="%"
          />

          <SelectInput
            label="Срок ипотеки"
            value={loanTerm}
            onChange={(value) => setLoanTerm(value)}
            suffix="года"
            options={['1', '2', '3', '5', '10', '15', '20', '25', '30']}
          />

          <DateInput
            label="Дата выдачи"
            value={startDate}
            onChange={(value) => setStartDate(value)}
          />

          <SelectInput
            label="Порядок погашения"
            value={paymentType}
            onChange={(value) => setPaymentType(value)}
            options={['Аннуитетный', 'Дифференцированный']}
          />

          <SelectInput
            label="Периодичность погашения"
            value={paymentFrequency}
            onChange={(value) => setPaymentFrequency(value)}
            options={['Ежемесячно', 'Еженедельно']}
          />
        </div>

        <p className="text-gray-500 text-sm mt-6 mb-8">
          Все расчеты являются предварительными и могут отличаться от фактически
          полученных
        </p>

        <div>
          <h3 className="text-[32px] font-bold mb-[22px]">Выбрать банк</h3>
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
        <MortgageResults {...calculationResults} />
      </div>
    </div>
  );
}
