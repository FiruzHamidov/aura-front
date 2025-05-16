'use client';

interface MortgageResultsProps {
  propertyPrice: string;
  interestRate: string;
  totalInterest: string;
  monthlyPayment: string;
}

export function MortgageResults({
  propertyPrice,
  interestRate,
  totalInterest,
  monthlyPayment,
}: MortgageResultsProps) {
  return (
    <div className="bg-white rounded-[22px] py-8 px-9">
      <div className="mb-8">
        <h3 className="text-lg mb-3">Стоимость недвижимости</h3>
        <p className="text-[#0036A5] text-[32px] font-bold">{propertyPrice}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg mb-3">Процентная ставка</h3>
        <p className="text-[#0036A5] text-[32px] font-bold">{interestRate}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg mb-3">Сумма переплаты</h3>
        <p className="text-[#0036A5] text-[32px] font-bold">{totalInterest}</p>
      </div>

      <div className="mb-10">
        <h3 className="text-lg mb-3">Ежемесячный платёж</h3>
        <p className="text-[#0036A5] text-[32px] font-bold">{monthlyPayment}</p>
      </div>

      <button className="w-full bg-[#0036A5] hover:bg-blue-800 text-white rounded-full py-5 transition-colors text-lg cursor-pointer">
        Отправить заявку
      </button>
    </div>
  );
}
